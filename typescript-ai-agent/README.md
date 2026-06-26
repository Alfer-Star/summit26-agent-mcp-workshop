# TypeScript AI Agent – Session 2

## Ziel dieser Session

Der Agent kann Produkte aus dem Webshop abrufen – mit einem einzigen Tool. In dieser Session verbesserst du den **System-Prompt** und erweiterst das bestehende Produktlisten-Tool um **Filterparameter** (Sprache, Suchbegriff, Produktgruppe), damit der Agent gezielter antworten kann.

**Startpunkt:** Agent + MCP-Server mit einem Tool (`request_product_list`) aus Session 1.  
**Ziel:** Verbesserter System-Prompt und ein flexibleres Produktlisten-Tool mit Filtern.

---

## Vorbereitung

### 1. Repository laden (Branch: `session_2_mcp`)

```bash
git clone -b session_2_mcp https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop
cd summit-26-agent-workshop/typescript-ai-agent
```

### 2. Relevante Dateien

```
typescript-ai-agent/
├── agent.ts              ← System-Prompt wird hier verbessert
├── mcp-server-shop.ts    ← Tool bekommt Filterparameter
├── request.ts            ← getProductList() unterstützt bereits Filter
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

Der aktuelle System-Prompt ist sehr allgemein. Öffne `agent.ts` und passe `SYSTEM_PROMPT` so an, dass der Agent klarer weiß, was er tun soll und was nicht:

```typescript
const SYSTEM_PROMPT = `
Du bist ein hilfreicher Einkaufs-Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.

Du kannst Produkte aus dem Shop anzeigen und nach Produkten suchen.

Wichtige Regeln:
- Frage nach, wenn der Benutzer nicht klar sagt, was er sucht (z.B. Kategorie, Stichwort).
- Antworte immer auf Deutsch, außer der Benutzer wechselt die Sprache.
- Du kannst noch keine Produkte kaufen oder in den Warenkorb legen – das kommt später.
`;
```

Starte den Agenten und teste, ob sich das Verhalten verbessert hat:
- "Was kann ich hier kaufen?"
- "Zeig mir etwas Warmes."
- "Gibt es Tassen?"

---

### Schritt 2: Produktlisten-Tool mit Filtern erweitern

Die Funktion `getProductList()` in `request.ts` unterstützt bereits drei optionale Parameter:

```typescript
getProductList(lang?, productGroupId?, searchQuery?)
```

Nutze diese in `mcp-server-shop.ts`, damit der Agent gezielt suchen kann:

```typescript
mcp.addTool({
  name: "request_product_list",
  description: "Gibt Produkte aus dem S&N Shop zurück. Kann nach Sprache, Produktgruppe oder Suchbegriff gefiltert werden.",
  parameters: z.object({
    lang: z.string().optional().describe('Sprache der Produktdaten, z.B. "de" oder "en". Standard: "de"'),
    productGroupId: z.string().optional().describe("Nur optional: Filtert auf eine bestimmte Produktgruppe (ID)"),
    searchQuery: z.string().optional().describe("Nur optional: Freitextsuche nach Produktname oder Beschreibung"),
  }),
  execute: async ({ lang, productGroupId, searchQuery }) => {
    const result = await getProductList(lang ?? "de", productGroupId, searchQuery);
    return `products: ${JSON.stringify(result)}`;
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

Teste die neuen Filtermöglichkeiten:
- "Suche nach Hoodies."
- "Show me all products in English."
- "Gibt es etwas für unter 30 Euro?" (Kann der Agent mit seiner begrenzten Tool-Basis sinnvoll antworten?)

---

### Schritt 4: Grenzen des Agenten beobachten

Mit nur einem Tool stoßt du jetzt bewusst an Grenzen. Teste:

- "In welchen Kategorien gibt es Produkte?" – Der Agent kennt keine Produktgruppen-IDs, kann also nicht sinnvoll filtern.
- "Lege eine Tasse in meinen Warenkorb." – Der Agent hat kein Warenkorb-Tool.

Beobachte, wie der Agent auf diese Anfragen reagiert. Passt seine Antwort zum System-Prompt?

Diese fehlenden Tools kommen in Session 3.

---

### Schritt 5: (Optional) MCP-Kommunikation verfolgen

Wenn du den `ToolDebugHandler` in `agent.ts` aktiviert hast, siehst du im Agenten-Terminal, welche Parameter der Agent an das Tool übergibt:

```
[Tool Call] request_product_list {"lang": "de", "searchQuery": "Hoodie"}
[Tool Result] request_product_list [{"id": "APP-003", "name": "Hoodie", ...}]
```

Teste, ob der Agent die Filterparameter korrekt befüllt – oder ob er alle Produkte abruft, obwohl eine Suche möglich wäre.

---

## Checkliste vor Session 3

- [ ] System-Prompt ist klarer und verhindert sinnlose Antworten
- [ ] `request_product_list` akzeptiert Filterparameter (`lang`, `searchQuery`, `productGroupId`)
- [ ] Agent nutzt Filterparameter bei gezielten Suchanfragen
- [ ] Grenzen des Agenten (kein Warenkorb, keine Produktgruppen) sind verstanden

---

## Weiter zu Session 3

In Session 3 fügst du die fehlenden Tools hinzu (`request_product_groups`, `add_to_basket`) und testest den kompletten Einkaufs-Workflow bis zum Checkout im Webshop-Frontend.

**Branch für Session 3:**
```bash
git clone -b session_3_agent_mcp_connect https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop
```
