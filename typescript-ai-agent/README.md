# TypeScript MCP Server – Session 2

## Ziel dieser Session

Der Agent aus Session 1 spricht mit Claude und kennt bereits ein einfaches, lokal definiertes Tool (`getTestData`) – aber noch keine MCP-Anbindung und keine echten Shop-Tools. In dieser Session passieren zwei Dinge: Du erweiterst `agent.ts` um die MCP-Anbindung und baust gleichzeitig den **MCP-Server** (`mcp-server-shop.ts`), der dem Agenten echte Werkzeuge für den S&N-Webshop bereitstellt.

**Startpunkt:** Chat-Agent aus Session 1 mit einem lokalen Test-Tool (`getTestData`), aber ohne MCP.  
**Ziel:** Agent ist per MCP mit dem Shop verbunden und kann Produkte abrufen.

---

## Vorbereitung

### 1. Auf den Branch dieser Session wechseln (`session_2_mcp`)

```bash
git checkout session_2_mcp
cd typescript-ai-agent
```

### 2. Relevante Dateien

```
typescript-ai-agent/
├── agent.ts              ← Agent (aus Session 1) – wird hier um MCP erweitert
├── mcp-server-shop.ts    ← MCP-Server – hier arbeitest du
├── request.ts            ← HTTP-Hilfsfunktionen (bereits vorhanden)
├── .env-example
└── package.json
```

### 3. Setup

```bash
cp .env-example .env
# ANTHROPIC_API_KEY in .env eintragen
npm install
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
agent.ts  (LangChain Agent + Claude-Modell)
    ↓  MCP-Protokoll (HTTP, Port 3010)
mcp-server-shop.ts  (FastMCP Server)
    ↓  HTTP-Requests
sn-webshop-server  (REST API, Port 3000)
```

- **`request.ts`** – Enthält fertige Hilfsfunktionen (`getProductList`, `postBasket`), die das REST-Backend aufrufen und sich automatisch authentifizieren.
- **`mcp-server-shop.ts`** – Der MCP-Server stellt diese Funktionen als Tools für den Agenten bereit.
- **`agent.ts`** – Der Agent verbindet sich beim Start mit dem MCP-Server und kennt dann alle verfügbaren Tools.

---

## Aufgaben

### Schritt 1: Agent um MCP-Anbindung erweitern

Öffne `agent.ts` und ergänze die MCP-Verbindung, damit der Agent später Tools vom MCP-Server nutzen kann.

**Import ergänzen:**

```typescript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
```

**MCP-Konfiguration hinzufügen** (vor `main()`):

```typescript
const mcpConfig = {
  shop: {
    transport: 'http' as const,
    url: 'http://127.0.0.1:3010/mcp',
  },
};
```

**`main()`-Funktion anpassen** – MCP-Client initialisieren und Tools an den Agent übergeben:

```typescript
async function main() {
  const client = new MultiServerMCPClient(mcpConfig);
  const tools = await client.getTools();

  const agent = createAgent({
    model: 'anthropic:claude-sonnet-4-6',
    tools,                    // ← Tools aus dem MCP-Server
    systemPrompt: SYSTEM_PROMPT,
  });

  // ... Rest der Funktion unverändert ...

  rl.close();
  await client.close();      // ← MCP-Verbindung sauber schließen
}
```

**System-Prompt anpassen**, damit der Agent weiß, dass er jetzt Shop-Tools hat:

```typescript
const SYSTEM_PROMPT = `
Du bist ein hilfreicher Einkaufs-Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.

Du hast Zugang zu Tools, mit denen du Produkte aus dem Shop abrufen kannst.
`;
```

**Hinweis:** Der Agent kann erst starten, wenn der MCP-Server auf Port 3010 läuft (Schritt 2). Starte den Agenten nach dem MCP-Server.

---

### Schritt 2: MCP-Server mit erstem Tool erstellen

Öffne `mcp-server-shop.ts`. Erstelle einen FastMCP-Server und füge das erste Tool hinzu:

```typescript
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getProductList } from "./request.js";

const mcp = new FastMCP({
  name: "S&N Webshop",
  version: "1.0.0",
  instructions: "Stellt Tools für die Interaktion mit dem S&N Webshop bereit.",
});

mcp.addTool({
  name: "requestProductList",
  description: "Gibt die Produktliste des S&N Shops zurück.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductList();
    return `products: ${JSON.stringify(result)}`;
  },
});

mcp.start({
  transportType: "httpStream",
  httpStream: { port: 3010 },
});
```

---

### Schritt 3: MCP-Server starten und testen

Starte den MCP-Server in einem separaten Terminal:

```bash
npm run mcp:start
```

Du solltest sehen, dass der Server auf Port 3010 läuft.

**Optional: MCP Inspector nutzen** – Damit kannst du Tools direkt im Browser testen:

```bash
npx @modelcontextprotocol/inspector
```

- Wähle Transport Type **"Streamable HTTP"**
- Setze URL auf `http://localhost:3010/mcp`
- Verbinde und teste das Tool `requestProductList`

---

### Schritt 4: Agenten starten und testen

Starte jetzt in einem dritten Terminal den Agenten:

```bash
npm run agent:start
```

Frage den Agenten:

- "Welche Produkte habt ihr im Angebot?"
- "Zeig mir alle Produkte."

Siehst du im Terminal des MCP-Servers, dass das Tool aufgerufen wurde?

---

### Schritt 5: (Optional) Tool-Debug-Logging im Agent aktivieren

Damit du siehst, welche Tools der Agent in welcher Reihenfolge aufruft, kannst du einen Debug-Handler in `agent.ts` ergänzen.

**Imports ergänzen:**

```typescript
import { BaseCallbackHandler } from '@langchain/core/callbacks/base';
import type { Serialized } from '@langchain/core/load/serializable';
```

**Klasse vor `main()` einfügen:**

```typescript
class ToolDebugHandler extends BaseCallbackHandler {
  name = 'ToolDebugHandler';
  private toolNames = new Map<string, string>();

  async handleToolStart(tool: Serialized, input: string, runId: string) {
    const toolName = (tool.id as string[])?.[tool.id.length - 1] ?? 'unknown';
    this.toolNames.set(runId, toolName);
    try {
      console.debug(`[Tool Call] ${toolName}`, JSON.parse(input));
    } catch {
      console.debug(`[Tool Call] ${toolName}`, input);
    }
  }

  async handleToolEnd(output: string, runId: string) {
    const toolName = this.toolNames.get(runId) ?? 'unknown';
    this.toolNames.delete(runId);
    console.debug(`[Tool Result] ${toolName}`, output);
  }
}
```

**`agent.invoke(...)` anpassen:**

```typescript
const result = await agent.invoke(
  { messages: [...messages, { role: 'user', content: userInput }] },
  { callbacks: [new ToolDebugHandler()] },
);
```

Du siehst dann im Agenten-Terminal z.B.:

```
[Tool Call] requestProductList {}
[Tool Result] requestProductList [{"id": "GAD-001", ...}]
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
git checkout session_3_agent_mcp_connect
```
