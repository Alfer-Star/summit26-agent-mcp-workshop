# TypeScript AI Agent – Session 3

## Ziel dieser Session

Der Agent kann am Ende von Session 2 Produkte abrufen – aber noch keine Produktgruppen abfragen und nichts in den Warenkorb legen. In dieser Session fügst du die zwei fehlenden Tools hinzu.

**Startpunkt:** Agent + MCP-Server mit einem Tool (`request_product_list`) aus Session 2.  
**Ziel:** `request_product_groups` und `add_to_basket` im MCP-Server registrieren.

---

## Vorbereitung

### 1. Repository laden (Branch: `session_3_agent_mcp_connect`)

```bash
git checkout session_3_agent_mcp_connect
cd summit-26-agent-workshop/typescript-ai-agent
```

### 2. Relevante Dateien

```
typescript-ai-agent/
├── mcp-server-shop.ts    ← Hier werden die neuen Tools ergänzt
├── request.ts            ← Hilfsfunktionen bereits vorhanden (kein Änderungsbedarf)
└── package.json
```

### 3. Webshop-Backend starten

```bash
cd ../sn-webshop-server
npm run server:start    # Port 3000
```

```bash
cd ../sn-webshop-client
npm run client:start    # Port 4200
```

---

## Aufgaben

### Schritt 1: Produktgruppen-Tool hinzufügen

In `request.ts` ist `getProductGroups()` bereits vorhanden. Registriere das Tool in `mcp-server-shop.ts`:

```typescript
import { getProductList, getProductGroups } from "./request.js";
```

```typescript
mcp.addTool({
  name: "request_product_groups",
  description: "Return all product groups from S&N Shop.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductGroups();
    return `product groups: ${JSON.stringify(result)}`;
  },
});
```

---

### Schritt 2: Warenkorb-Tool hinzufügen

`postBasket()` in `request.ts` ist ebenfalls schon vorhanden. Ergänze den Import und füge das Tool hinzu:

```typescript
import { getProductList, getProductGroups, postBasket } from "./request.js";
```

```typescript
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
```

---

### Schritt 3: Alles starten und testen

Öffne zwei Terminals:

**Terminal 1 – MCP-Server:**
```bash
cd typescript-ai-agent && npm run mcp:start
```

**Terminal 2 – Agent:**
```bash
cd typescript-ai-agent && npm run agent:start
```

Teste den vollständigen Einkaufs-Workflow:
1. "In welchen Kategorien gibt es Produkte?"
2. "Welche Hoodies habt ihr?"
3. "Lege einen Hoodie in meinen Warenkorb."
4. Öffne den Webshop unter `http://localhost:4200` und prüfe, ob der Artikel im Warenkorb erscheint.

---

### Schritt 4: (Optional) MCP-Kommunikation verfolgen

Der `ToolDebugHandler` in `agent.ts` zeigt im Terminal, welche Tools der Agent aufruft:

```
[Tool Call] request_product_groups {}
[Tool Result] request_product_groups [{"id": "GRP-001", "name": "Hoodies", ...}]
[Tool Call] request_product_list {}
[Tool Result] request_product_list [{"id": "APP-003", "name": "Hoodie", ...}]
[Tool Call] add_to_basket {"productId": "APP-003", "quantity": 1}
[Tool Result] add_to_basket {"success": true}
```

---

## Checkliste

- [ ] `request_product_groups` ist im MCP-Server registriert
- [ ] `add_to_basket` ist im MCP-Server registriert
- [ ] Agent kann einen vollständigen Einkauf durchführen (Kategorien → Produkte → Warenkorb)
- [ ] Artikel erscheint nach dem Chat im Webshop-Frontend unter `http://localhost:4200`
