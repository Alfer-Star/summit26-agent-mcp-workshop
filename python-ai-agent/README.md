# TypeScript AI Agent – Session 2

## Ziel dieser Session

Der Agent aus Session 1 spricht mit Claude, kennt aber noch keine Tools. In dieser Session passieren zwei Dinge: Du erweiterst `agent.py` um die MCP-Anbindung und baust gleichzeitig den **MCP-Server** (`mcp-server-shop.py`), der dem Agenten echte Werkzeuge für den S&N-Webshop bereitstellt.

**Startpunkt:** Einfacher Chat-Agent ohne Tools aus Session 1.  
**Ziel:** Agent ist per MCP mit dem Shop verbunden und kann Produkte und Produktgruppen abrufen.

---

## Vorbereitung

### 1. Repository laden (Branch: `session_1_agent`)

```bash
git clone -b session_1_agent https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop
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
uv sync
```

### 4. Webshop-Backend starten

Der MCP-Server ruft das REST-Backend des Webshops auf. Starte es in einem separaten Terminal:

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

  // ... Rest der Funktion unverändert ...
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

**Hinweis:** Der Agent kann erst starten, wenn der MCP-Server auf Port 3010 läuft (Schritt 3). Starte den Agenten nach dem MCP-Server.

---

### Schritt 3: MCP-Server mit erstem Tool erstellen

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

### Schritt 4: MCP-Server starten und testen

Starte den MCP-Server in einem separaten Terminal:

```bash
uv run mcp-server-shop.py
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

### Schritt 5: Agenten starten und testen

Starte jetzt in einem dritten Terminal den Agenten:

```bash
uv run agent.py
```

Frage den Agenten:

- "Welche Produkte habt ihr im Angebot?"
- "Zeig mir alle Produkte."

Siehst du im Terminal des MCP-Servers, dass das Tool aufgerufen wurde?

---

### Schritt 6: (Optional) Tool-Debug-Logging im Agent aktivieren

Damit du siehst, welche Tools der Agent in welcher Reihenfolge aufruft, kannst du einen Debug-Handler in `agent.ts` ergänzen.

**Imports ergänzen:**

```python
import json
import logging

from langchain_core.callbacks import BaseCallbackHandler
```

**Klasse vor `main()` einfügen:**

```python

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class ToolDebugHandler(BaseCallbackHandler):
    name = "ToolDebugHandler"

    def __init__(self) -> None:
        self.tool_names: dict[str, str] = {}

    def on_tool_start(
        self,
        serialized: dict[str, Any],
        input_str: str,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        tool_id = serialized.get("id", [])
        tool_name = tool_id[-1] if isinstance(tool_id, list) and tool_id else "unknown"

        run_id_str = str(run_id)
        self.tool_names[run_id_str] = tool_name

        try:
            tool_input = json.loads(input_str)
        except (json.JSONDecodeError, TypeError):
            tool_input = input_str

        logger.debug("[Tool Call] %s %s", tool_name, tool_input)

    def on_tool_end(
        self,
        output: Any,
        *,
        run_id: UUID,
        **kwargs: Any,
    ) -> None:
        run_id_str = str(run_id)
        tool_name = self.tool_names.pop(run_id_str, "unknown")

        logger.debug("[Tool Result] %s %s", tool_name, output)
```

**`agent.invoke(...)` anpassen:**

```python
result = agent.invoke(
    {
        "messages": [
            *messages,
            {"role": "user", "content": user_input},
        ]
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

## Checkliste vor Session 2

- [ ] Webshop-Backend läuft auf Port 3000
- [ ] MCP-Server startet ohne Fehler auf Port 3010
- [ ] Agent ruft Produktliste via `request_product_list` ab
- [ ] Tool-Aufruf ist im Terminal des MCP-Servers sichtbar

---

## Weiter zu Session 2

In Session 2 verbesserst du den System-Prompt und optimierst das bestehende Tool mit Filterparametern (Sprache, Suchbegriff).

**Branch für Session 2:**

```bash
git clone -b session_2_mcp https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop
```
