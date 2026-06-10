# TypeScript AI Agent — Workshop Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `typescript-ai-agent/` als 1:1-Entsprechung zu `python-ai-agent/` — drei Dateien (request.ts, mcp-server-shop.ts, agent.ts) plus Projekt-Scaffold, ausführbar über `npm run mcp:start` und `npm run agent:start`.

**Architecture:** HTTP-Client (`request.ts`) kapselt die Shop-REST-API mit JWT-Auth. Ein fastmcp-Server (`mcp-server-shop.ts`) stellt drei MCP-Tools bereit. Ein LangChain-Agent (`agent.ts`) verbindet sich via `MultiServerMCPClient` mit dem MCP-Server und beantwortet Shop-Fragen.

**Tech Stack:** TypeScript, tsx (Runtime), fastmcp (MCP-Server), @langchain/langgraph + @langchain/anthropic + @langchain/mcp-adapters (Agent), zod (Tool-Parameter), dotenv, native fetch (Node 18+).

---

## File Map

| Datei | Neu/Änderung | Verantwortung |
|---|---|---|
| `typescript-ai-agent/package.json` | Neu | Dependencies, npm scripts |
| `typescript-ai-agent/tsconfig.json` | Neu | TypeScript-Konfiguration (IDE-Support) |
| `typescript-ai-agent/.env-example` | Neu | ANTHROPIC_API_KEY Platzhalter |
| `typescript-ai-agent/.gitignore` | Neu | node_modules, .env ausschließen |
| `typescript-ai-agent/request.ts` | Neu | ShopAuth + API-Funktionen |
| `typescript-ai-agent/mcp-server-shop.ts` | Neu | fastmcp-Server mit 3 Tools |
| `typescript-ai-agent/agent.ts` | Neu | LangChain-Agent mit MCP-Client |

---

## Task 1: Projekt-Scaffold

**Files:**
- Create: `typescript-ai-agent/package.json`
- Create: `typescript-ai-agent/tsconfig.json`
- Create: `typescript-ai-agent/.env-example`
- Create: `typescript-ai-agent/.gitignore`

- [ ] **Step 1: package.json anlegen**

```json
{
  "name": "typescript-ai-agent",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "agent:start": "tsx agent.ts",
    "mcp:start": "tsx mcp-server-shop.ts"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.3",
    "@langchain/langgraph": "^0.2",
    "@langchain/mcp-adapters": "^0.1",
    "dotenv": "^16",
    "fastmcp": "^2",
    "zod": "^3"
  },
  "devDependencies": {
    "tsx": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: tsconfig.json anlegen**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

- [ ] **Step 3: .env-example anlegen**

```
ANTHROPIC_API_KEY=your-api-key
```

- [ ] **Step 4: .gitignore anlegen**

```
node_modules/
.env
dist/
```

- [ ] **Step 5: Dependencies installieren**

```bash
cd typescript-ai-agent && npm install
```

Erwartete Ausgabe: `added N packages` ohne Fehler.

- [ ] **Step 6: Commit**

```bash
git add typescript-ai-agent/package.json typescript-ai-agent/tsconfig.json typescript-ai-agent/.env-example typescript-ai-agent/.gitignore typescript-ai-agent/package-lock.json
git commit -m "feat: scaffold typescript-ai-agent project"
```

---

## Task 2: request.ts — HTTP-Client mit JWT-Auth

**Files:**
- Create: `typescript-ai-agent/request.ts`

Portierung von `python-ai-agent/request.py`. Verwendet native `fetch` (Node 18+). Gleiche Logik: Singleton-Auth-Objekt, Token-Caching, Header `x-access-token`.

- [ ] **Step 1: request.ts anlegen**

```typescript
import "dotenv/config";

const SHOP_API_BASE = "http://localhost:3000/";

class ShopAuth {
  private token: string | null = null;
  private tokenExpiry = 0;
  userId: number | null = null;

  constructor(
    private email: string,
    private password: string,
  ) {}

  async ensureAuthenticated(): Promise<void> {
    if (this.token && Date.now() < this.tokenExpiry) return;

    const resp = await fetch(SHOP_API_BASE + "auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });

    if (!resp.ok) throw new Error(`Auth failed: ${resp.status}`);

    const data = await resp.json();
    this.token = data.accessToken;
    this.tokenExpiry = Date.now() + (7200 - 60) * 1000;
    this.userId = data.user.id;
  }

  getToken(): string {
    return this.token!;
  }
}

const _auth = new ShopAuth("test@test.de", "password1");

export async function getProductList(
  lang = "de",
  productGroupId?: string,
  searchQuery?: string,
) {
  return _get("products/get", { lang, productGroupId, searchQuery });
}

export async function getProductGroups(lang = "de") {
  return _get("product-groups/get", { lang });
}

export async function postBasket(productId: string, quantity: number) {
  await _auth.ensureAuthenticated();
  return _post("basket/items", {
    userId: _auth.userId,
    productId,
    quantity,
  });
}

async function _get(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  await _auth.ensureAuthenticated();
  const url = new URL(SHOP_API_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  const resp = await fetch(url.toString(), {
    headers: { "x-access-token": _auth.getToken() },
  });
  if (!resp.ok) return null;
  return resp.json();
}

async function _post(path: string, data: Record<string, unknown>) {
  await _auth.ensureAuthenticated();
  const resp = await fetch(SHOP_API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": _auth.getToken(),
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) return null;
  return resp.json();
}
```

- [ ] **Step 2: Shop-Server starten (Voraussetzung für manuellen Test)**

In einem separaten Terminal:
```bash
cd sn-webshop-server && npm install && npm run server:start
```

Erwartete Ausgabe: `Server is running on port 3000.`

- [ ] **Step 3: request.ts manuell testen**

Temporär am Ende von `request.ts` hinzufügen (danach wieder entfernen):
```typescript
// Temporärer Test — nach Verifikation entfernen
const products = await getProductList();
console.log("Products:", JSON.stringify(products, null, 2));
```

Ausführen:
```bash
cd typescript-ai-agent && cp .env-example .env  # ANTHROPIC_API_KEY setzen
npm run agent:start  # oder: npx tsx request.ts
```

Warte - für einen direkten Test: `npx tsx request.ts`

Erwartete Ausgabe: JSON-Array mit Produkten aus dem Shop.

- [ ] **Step 4: Temporären Test-Code entfernen, committen**

```bash
git add typescript-ai-agent/request.ts
git commit -m "feat: add shop API HTTP client with JWT auth"
```

---

## Task 3: mcp-server-shop.ts — fastmcp MCP-Server

**Files:**
- Create: `typescript-ai-agent/mcp-server-shop.ts`

Server lauscht auf Port 9000, Endpoint `/mcp` (fastmcp-Default). Drei Tools:
- `request_product_list` — Teil 2 des Workshops
- `request_product_groups` — Teil 2 des Workshops
- `add_to_basket` — Teil 3 des Workshops

- [ ] **Step 1: mcp-server-shop.ts anlegen**

```typescript
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getProductList, getProductGroups, postBasket } from "./request.js";

const mcp = new FastMCP({
  name: "S&N Webshop",
  version: "1.0.0",
  instructions:
    "Provides tools for interacting with Webshop, like showing products, adding items to the cart and more.",
});

mcp.addTool({
  name: "request_product_list",
  description: "Return product list from S&N Shop.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductList();
    return `products: ${JSON.stringify(result)}`;
  },
});

mcp.addTool({
  name: "request_product_groups",
  description: "Return all product groups from S&N Shop.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductGroups();
    return `product groups: ${JSON.stringify(result)}`;
  },
});

mcp.addTool({
  name: "add_to_basket",
  description: "Add a product to the shopping basket.",
  parameters: z.object({
    productId: z.string().describe('Product ID, e.g. "GAD-001"'),
    quantity: z.number().int().positive().describe("Number of items to add"),
  }),
  execute: async ({ productId, quantity }) => {
    const result = await postBasket(productId, quantity);
    return `basket: ${JSON.stringify(result)}`;
  },
});

mcp.start({
  transportType: "httpStream",
  httpStream: { port: 9000 },
});
```

- [ ] **Step 2: MCP-Server starten und verifizieren**

Shop-Server muss bereits laufen (Task 2, Step 2).

```bash
cd typescript-ai-agent && npm run mcp:start
```

Erwartete Ausgabe:
```
FastMCP server "S&N Webshop" running on http://0.0.0.0:9000/mcp
```

Server mit Ctrl+C stoppen nach Verifikation.

- [ ] **Step 3: Commit**

```bash
git add typescript-ai-agent/mcp-server-shop.ts
git commit -m "feat: add fastmcp MCP server with product and basket tools"
```

---

## Task 4: agent.ts — LangChain-Agent

**Files:**
- Create: `typescript-ai-agent/agent.ts`

Entspricht `python-ai-agent/agent.py`. Verbindet sich mit dem laufenden MCP-Server auf Port 9000 und ruft `agent.invoke()` mit einer Beispiel-Frage auf.

- [ ] **Step 1: agent.ts anlegen**

```typescript
import "dotenv/config";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";

const SYSTEM_PROMPT = `
You are a helpful shopping assistant for the S&N Shop.

S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more. 

You have access to the following tools to help you user interacting with the Workshop:
`;

const mcpConfig = {
  shop: {
    transport: "streamable_http" as const,
    url: "http://127.0.0.1:9000/mcp",
  },
};

async function main() {
  const client = new MultiServerMCPClient(mcpConfig);

  const tools = await client.getTools();

  const agent = createReactAgent({
    llm: new ChatAnthropic({ model: "claude-sonnet-4-6" }),
    tools,
    stateModifier: SYSTEM_PROMPT,
  });

  const result = await agent.invoke({
    messages: [{ role: "user", content: "What products do you have in your shop?" }],
  });

  console.log(result.messages[result.messages.length - 1].content);

  await client.close();
}

main();
```

- [ ] **Step 2: End-to-End-Test**

In Terminal 1 (Shop-Server, falls nicht schon läuft):
```bash
cd sn-webshop-server && npm run server:start
```

In Terminal 2 (MCP-Server):
```bash
cd typescript-ai-agent && npm run mcp:start
```

In Terminal 3 (Agent):
```bash
cd typescript-ai-agent && npm run agent:start
```

Erwartete Ausgabe in Terminal 3: Eine natürlichsprachliche Antwort des Agenten mit einer Liste der Produkte aus dem Shop.

- [ ] **Step 3: Commit**

```bash
git add typescript-ai-agent/agent.ts
git commit -m "feat: add LangChain agent with MCP client integration"
```

---

## Task 5: .env-Datei anlegen & Abschluss-Commit

**Files:**
- Verify: `typescript-ai-agent/.env-example` (bereits committed)

- [ ] **Step 1: Sicherstellen dass .env in .gitignore ist**

```bash
grep -q "^\.env$" typescript-ai-agent/.gitignore && echo "OK" || echo "MISSING"
```

Erwartete Ausgabe: `OK`

- [ ] **Step 2: Abschluss-Commit (falls noch nicht alles committed)**

```bash
git status
```

Alle Dateien in `typescript-ai-agent/` sollten committed sein. Falls nicht:

```bash
git add typescript-ai-agent/
git commit -m "feat: complete typescript-ai-agent workshop implementation"
```

---

## Abhängigkeiten zwischen Tasks

```
Task 1 (Scaffold + npm install)
  └─> Task 2 (request.ts) — braucht node_modules
        └─> Task 3 (mcp-server-shop.ts) — importiert request.ts
              └─> Task 4 (agent.ts) — verbindet sich mit MCP-Server
                    └─> Task 5 (Abschluss)
```

Tasks müssen sequentiell ausgeführt werden.
