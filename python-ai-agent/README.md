# Python AI Agent – Session 2

## Ziel dieser Session

Der Agent aus Session 1 spricht mit Claude und kennt bereits ein einfaches, lokal definiertes Tool (`getTestData`) – aber noch keine MCP-Anbindung und keine echten Shop-Tools. In dieser Session passieren zwei Dinge: Du erweiterst `agent.py` um die MCP-Anbindung und baust gleichzeitig den **MCP-Server** (`mcp-server-shop.py`), der dem Agenten echte Werkzeuge für den S&N-Webshop bereitstellt.

**Startpunkt:** Einfacher Chat-Agent mit einem lokalen Test-Tool (`getTestData`) aus Session 1.  
**Ziel:** Agent ist per MCP mit dem Shop verbunden und kann Produkte und Produktgruppen abrufen.

---

## Vorbereitung

### 1. Repository laden (Branch: `session_1_agent`)

```bash
git checkout -f session_2_mcp
cd summit-26-agent-workshop/python-ai-agent
```

### 2. Relevante Dateien

```
python-ai-agent/
├── agent.py              ← Agent (aus Session 0) – wird hier um MCP erweitert
├── mcp-server-shop.py    ← MCP-Server – hier arbeitest du
├── request.py            ← HTTP-Hilfsfunktionen (bereits vorhanden)
├── .env-example
└── package.json
```

### 3. Setup

```bash
cp .env-example .env
# ANTHROPIC_API_KEY in .env eintragen
powershell -ExecutionPolicy ByPass -c "uv sync"

```

### 4. Webshop-Backend starten

Der MCP-Server ruft das REST-Backend des Webshops auf. Starte es in einem separaten Terminal im Projekt root Verzeichnis:

```bash
cd ../sn-webshop-server
npm install
npm run server:start    # Startet Express auf Port 3000
```

---

## Architektur verstehen

```
Du (Konsole)
    ↓
agent.py  (LangChain Agent + Claude-Modell)
    ↓  MCP-Protokoll (HTTP, Port 3010)
mcp-server-shop.py  (FastMCP Server)
    ↓  HTTP-Requests
sn-webshop-server  (REST API, Port 3000)
```

- **`request.py`** – Enthält fertige Hilfsfunktionen (`getProductList`, `getProductGroups`, `postBasket`), die das REST-Backend aufrufen und sich automatisch authentifizieren.
- **`mcp-server-shop.py`** – Der MCP-Server stellt diese Funktionen als Tools für den Agenten bereit.
- **`agent.py`** – Der Agent verbindet sich beim Start mit dem MCP-Server und kennt dann alle verfügbaren Tools.

---

## Aufgaben

### Schritt 1: Agent um MCP-Anbindung erweitern

Öffne `agent.py` und ergänze die MCP-Verbindung, damit der Agent später Tools vom MCP-Server nutzen kann.

**Import ergänzen:**

```typescript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
```

**MCP-Konfiguration hinzufügen** (vor `main()`):

```python
mcp_config = {
    "shop": {
        "transport": "http", 
        "url": "http://127.0.0.1:9000/mcp",
    }
}
```

**`main()`-Funktion anpassen** – MCP-Client initialisieren und Tools an den Agent übergeben:

```python
async function main() {
    client = MultiServerMCPClient(mcp_config)
    tools = await client.get_tools()

    agent = create_agent(
        model="claude-sonnet-4-6",
        tools=tools,              # ← Tools aus dem MCP-Server
        system_prompt=SYSTEM_PROMPT,
    )

  # ... Rest der Funktion unverändert ...
}
```

**System-Prompt anpassen**, damit der Agent weiß, dass er jetzt Shop-Tools hat:

```python
SYSTEM_PROMPT = """
Du bist ein hilfreicher Einkaufs-Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.

Du hast Zugang zu Tools, mit denen du Produkte und Produktgruppen aus dem Shop abrufen kannst.
""";
```

**Hinweis:** Der Agent kann erst starten, wenn der MCP-Server auf Port 3010 läuft (Schritt 2). Starte den Agenten nach dem MCP-Server.

---

### Schritt 2: MCP-Server mit erstem Tool erstellen

Öffne `mcp-server-shop.ts`. Erstelle einen FastMCP-Server und füge das erste Tool hinzu:

```python
from fastmcp import FastMCP

from request import get_product_list

mcp = FastMCP(
    "S&N Webshop",
    instructions="Provides tools for interacting with Webshop, like shwoing products, adding items to the cart and more.",
)

@mcp.tool()
async def request_product_list() -> str:
    """Return product list from S&N Shop."""
    result = await get_product_list()
    return f'products: {result}'

def main():
    # Initialize and run the server
    mcp.run(transport="http", host="127.0.0.1", port=9000)
    
if __name__ == "__main__":
    main()
```

---

### Schritt 3: MCP-Server starten und testen

Starte den MCP-Server in einem separaten Terminal:

```bash
uv run mcp-server-shop.py
```

oder

```bash
powershell -ExecutionPolicy ByPass -c "uv run mcp-server-shop.py"
```

Du solltest sehen, dass der Server auf Port 3010 läuft.

**Optional: MCP Inspector nutzen** – Damit kannst du Tools direkt im Browser testen:

```bash
npx @modelcontextprotocol/inspector
```

- Wähle Transport Type **"Streamable HTTP"**
- Setze URL auf `http://localhost:3010/mcp`
- Verbinde und teste das Tool `request_product_list`

---

### Schritt 4: Agenten starten und testen

Starte jetzt in einem dritten Terminal den Agenten:

```bash
uv run agent.py
```

```bash
powershell -ExecutionPolicy ByPass -c "uv run magent.py"
```

Frage den Agenten:

- "Welche Produkte habt ihr im Angebot?"
- "Zeig mir alle Produkte."

Siehst du im Terminal des MCP-Servers, dass das Tool aufgerufen wurde?

---

### Schritt 5: (Optional) Tool-Debug-Logging im Agent aktivieren

Damit du siehst, welche Tools der Agent in welcher Reihenfolge aufruft, kannst du einen Debug-Handler in `agent.py` ergänzen.

**Imports ergänzen:**

```python
import json

from typing import Any
from uuid import UUID

from langchain_core.callbacks import BaseCallbackHandler
```

**Klasse vor `main()` einfügen:**

```python
class ToolDebugHandler(BaseCallbackHandler):
    def __init__(self):
        super().__init__()
        self._tool_names: dict[UUID, str] = {}

    def on_tool_start(self, serialized: dict[str, Any], input_str: str, *, run_id: UUID, **kwargs: Any) -> None:
        tool_name = serialized.get("name", "unknown")
        self._tool_names[run_id] = tool_name
        print(f"[Tool Call] {tool_name} {input_str}")

    def on_tool_end(self, output: Any, *, run_id: UUID, **kwargs: Any) -> None:
        tool_name = self._tool_names.pop(run_id, "unknown")
        print(f"[Tool Result] {tool_name} {output}")
```

**`agent.invoke(...)` anpassen:**

```python
result = agent.invoke(
    {
        "messages": messages
    },
    config={
        "callbacks": [ToolDebugHandler()],
    },
)
```

Du siehst dann im Agenten-Terminal z.B.:

```
[Tool Call] request_product_list {}
[Tool Result] request_product_list [{"id": "GAD-001", ...}]
```

---

## Checkliste vor Session 3

- [ ] Webshop-Backend läuft auf Port 3000
- [ ] MCP-Server startet ohne Fehler auf Port 3010
- [ ] Agent ruft Produktliste via `requestProductList` ab
- [ ] Tool-Aufruf ist im Terminal des MCP-Servers sichtbar

---

## Weiter zu Session 3

In Session 3 verbesserst du den System-Prompt und ergänzt das fehlende Warenkorb-Tool (`addToBasket`), sodass der komplette Einkaufs-Workflow bis zum Checkout im Webshop funktioniert.

**Branch für Session 3:**

```bash
git checkout -f session_3_agent_mcp_connect
```

> **Hinweis:** `-f` verwirft deine lokalen Änderungen (deine bisherige Lösung). Das ist hier gewollt – der Zielbranch enthält den passenden Stand bereits.
