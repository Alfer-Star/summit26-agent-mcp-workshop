# TypeScript AI Agent – Session 3

## Ziel dieser Session

Der Agent kann Produkte aus dem Webshop abrufen – mit einem einzigen Tool (`requestProductList`). In dieser letzten Session verbesserst du den **System-Prompt** und ergänzt das fehlende **Warenkorb-Tool** (`addToBasket`), sodass der komplette Einkaufs-Workflow bis zum Checkout im Webshop-Frontend funktioniert.

**Startpunkt:** Agent + MCP-Server mit einem Tool (`requestProductList`) aus Session 2.  
**Ziel:** Verbesserter System-Prompt und ein zusätzliches Tool `addToBasket` – damit entspricht dein Stand funktional der Referenzlösung im Branch `main`.

---

## Vorbereitung

### 1. Auf den Branch dieser Session wechseln (`session_3_agent_mcp_connect`)

```bash
git checkout -f session_3_agent_mcp_connect
cd typescript-ai-agent
```

### 2. Relevante Dateien

```
typescript-ai-agent/
├── agent.ts              ← System-Prompt wird hier verbessert
├── mcp-server-shop.ts    ← hier kommt das addToBasket-Tool dazu
├── request.ts            ← postBasket() ist bereits vorhanden
└── package.json
```

### 3. Setup

```bash
cp .env-example .env
# ANTHROPIC_API_KEY in .env eintragen
npm install
```

### 4. Webshop-Backend starten

```bash
cd ../sn-webshop-server
npm install
npm run server:start    # Port 3000
```

---

## Aufgaben

### Schritt 1: System-Prompt verbessern

Der aktuelle System-Prompt ist sehr allgemein. Öffne `agent.ts` und passe `SYSTEM_PROMPT` so an, dass der Agent klarer weiß, was er tun kann:

```typescript
const SYSTEM_PROMPT = `
Du bist ein hilfreicher Einkaufs-Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.

Du kannst Produkte aus dem Shop anzeigen und Produkte in den Warenkorb legen.

Wichtige Regeln:
- Frage nach, wenn der Benutzer nicht klar sagt, was er sucht (z.B. Kategorie, Stichwort).
- Antworte immer auf Deutsch, außer der Benutzer wechselt die Sprache.
- Lege erst dann etwas in den Warenkorb, wenn Produkt und Menge klar sind.
`;
```

Starte den Agenten und teste, ob sich das Verhalten verbessert hat:
- "Was kann ich hier kaufen?"
- "Zeig mir etwas Warmes."
- "Gibt es Tassen?"

---

### Schritt 2: Warenkorb-Tool `addToBasket` ergänzen

Bisher kann der Agent nur Produkte anzeigen. Damit er auch etwas in den Warenkorb legen kann, ergänzt du ein zweites Tool im MCP-Server.

Die Funktion `postBasket(productId, quantity)` in `request.ts` ist bereits vorhanden und authentifiziert sich automatisch. Füge in `mcp-server-shop.ts` das neue Tool hinzu (das bestehende `requestProductList`-Tool bleibt unverändert):

```typescript
import { getProductList, postBasket } from "./request.js";

// ... bestehendes requestProductList-Tool bleibt unverändert ...

mcp.addTool({
  name: "addToBasket",
  description: "Legt ein Produkt in den Warenkorb des S&N Shops.",
  parameters: z.object({
    productId: z.string().describe('Produkt-ID, z.B. "GAD-001"'),
    quantity: z.number().int().positive().describe("Anzahl der Artikel"),
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

Teste jetzt den kompletten Einkaufs-Workflow:
- "Zeig mir eure Hoodies."
- "Leg mir bitte eine Tasse in den Warenkorb."
- "Ich hätte gerne zwei T-Shirts."

---

### Schritt 4: Warenkorb im Frontend prüfen

Öffne den Webshop im Browser unter **http://localhost:4200** und melde dich mit dem Testaccount an (E-Mail **test@test.de**, Passwort **password1**). Sieh im Warenkorb nach, ob die vom Agenten hinzugefügten Artikel dort auftauchen, und führe den Bestellvorgang bis zum Checkout durch.

---

### Schritt 5: (Optional) MCP-Kommunikation verfolgen

Wenn du den `ToolDebugHandler` in `agent.ts` aktiviert hast, siehst du im Agenten-Terminal, welche Tools der Agent mit welchen Parametern aufruft:

```
[Tool Call] requestProductList {}
[Tool Result] requestProductList [{"id": "APP-003", "name": "Hoodie", ...}]
[Tool Call] addToBasket {"productId": "APP-003", "quantity": 1}
[Tool Result] addToBasket {"success": true, ...}
```

---

## Abschluss-Checkliste

- [ ] System-Prompt ist klarer und beschreibt, was der Agent kann
- [ ] `addToBasket`-Tool ist im MCP-Server ergänzt
- [ ] Agent kann Produkte anzeigen UND in den Warenkorb legen
- [ ] Artikel tauchen im Webshop-Frontend (http://localhost:4200) im Warenkorb auf

---

## Weiter zur Lösung (`main`)

Der Branch `main` enthält die vollständige Referenzlösung (Agent + MCP-Server mit `requestProductList` und `addToBasket`). Vergleiche deinen Stand damit:

```bash
git checkout -f main
```

> **Hinweis:** `-f` verwirft deine lokalen Änderungen (deine bisherige Lösung). Das ist hier gewollt – der Zielbranch enthält den passenden Stand bereits.
