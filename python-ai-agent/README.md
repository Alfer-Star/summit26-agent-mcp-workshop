# Python AI Agent mit MCP – Session 3

## Ziel dieser Session

Der Agent kann Produkte aus dem Webshop abrufen – mit einem einzigen Tool (`requestProductList`). In dieser letzten Session verbesserst du den **System-Prompt** und ergänzt das fehlende **Warenkorb-Tool** (`addToBasket`), sodass der komplette Einkaufs-Workflow bis zum Checkout im Webshop-Frontend funktioniert.

**Startpunkt:** Agent + MCP-Server mit einem Tool (`request_product_list`) aus Session 2.
**Ziel:** Verbesserter System-Prompt und ein zusätzliches Tool `addToBasket` – damit entspricht dein Stand funktional der Referenzlösung im Branch `main`.

---

## Vorbereitung

### 1.  Auf den Branch dieser Session wechseln (Branch: `session_3_agent_mcp_connect`)

```bash
git checkout -f session_3_agent_mcp_connect
cd typescript-ai-agent
```

### 2. Relevante Dateien

```
python-ai-agent/
├── agent.py              ← System-Prompt wird hier verbessert
├── mcp-server-shop.py    ← hier kommt das addToBasket-Tool dazu
├── request.py            ← postBasket() ist bereits vorhanden
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

Der aktuelle System-Prompt ist sehr allgemein. Öffne `agent.py` und passe `SYSTEM_PROMPT` so an, dass der Agent klarer weiß, was er tun kann:

```python
SYSTEM_PROMPT = """
Du bist ein hilfreicher Einkaufs-Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.

Du kannst Produkte aus dem Shop anzeigen und Produkte in den Warenkorb legen.

Wichtige Regeln:
- Frage nach, wenn der Benutzer nicht klar sagt, was er sucht (z.B. Kategorie, Stichwort).
- Antworte immer auf Deutsch, außer der Benutzer wechselt die Sprache.
- Lege erst dann etwas in den Warenkorb, wenn Produkt und Menge klar sind.
"""
```

In `request.py` ist `getProductGroups()` bereits vorhanden. Registriere das Tool in `mcp-server-shop.py`:

```python
from request import getProductGroups

# ...

@mcp.tool()
async def request_product_groups() -> str:
    """Return all product groups from S&N Shop."""
    result = await get_product_groups()
    return f'product groups: {result}'
```

---

### Schritt 2: Warenkorb-Tool hinzufügen

Bisher kann der Agent nur Produkte anzeigen. Damit er auch etwas in den Warenkorb legen kann, ergänzt du ein zweites Tool im MCP-Server.

Die Funktion `postBasket(productId, quantity)` in `request.py` ist bereits vorhanden und authentifiziert sich automatisch. Füge in `mcp-server-shop.ts` das neue Tool hinzu (das bestehende `requestProductList`-Tool bleibt unverändert):

```python
from request import get_product_list, request_product_groups, get_product, get_basket, post_basket

# ...

@mcp.tool
async def add_to_basket(productId: str, quantity: int) -> str:
    """ Add a product to the shopping basket.
        
        Args:
          productId: Product ID, e.g. "GAD-001"
          quantity: Number of items to add
    """
    result = await get_product_groups()
    return f'product groups: {result}'
```

**Fun Fact** Wie dir bestimmt schon aufgefallen ist: FastMCP wandelt Python-Funktionen in MCP-Tools um, indem es die Signatur und die Typangaben der Funktion analysiert. Deshalb nutzen wir den Doc String der Funktion als Aufrufbeschreibung.  

---

### Schritt 3: Alles starten und testen

Öffne zwei Terminals:

**Terminal 1 – MCP-Server:**

```bash
cd python-ai-agent && uv run mcp-server-shop.py
```

oder

```bash
powershell -ExecutionPolicy ByPass -c "uv run mcp-server-shop.py"
```

**Terminal 2 – Agent:**

```bash
cd python-ai-agent && uv run agent.py
```

oder

```bash
powershell -ExecutionPolicy ByPass -c "uv run agent.py"
```

Teste den vollständigen Einkaufs-Workflow:

- "Zeig mir eure Hoodies."
- "Leg mir bitte eine Tasse in den Warenkorb."
- "Ich hätte gerne zwei T-Shirts."

---

### Schritt 4: Warenkorb im Frontend prüfen

Öffne den Webshop im Browser unter **<http://localhost:4200>** und melde dich mit dem Testaccount an (E-Mail **<test@test.de>**, Passwort **password1**). Sieh im Warenkorb nach, ob die vom Agenten hinzugefügten Artikel dort auftauchen, und führe den Bestellvorgang bis zum Checkout durch.

---

### Schritt 5: (Optional) MCP-Kommunikation verfolgen

Wenn du den `ToolDebugHandler` in `agent.py` aktiviert hast, siehst du im Agenten-Terminal, welche Tools der Agent mit welchen Parametern aufruft:

```
[Tool Call] request_product_groups {}
[Tool Result] request_product_groups [{"id": "GRP-001", "name": "Hoodies", ...}]
[Tool Call] request_product_list {}
[Tool Result] request_product_list [{"id": "APP-003", "name": "Hoodie", ...}]
[Tool Call] add_to_basket {"productId": "APP-003", "quantity": 1}
[Tool Result] add_to_basket {"success": true}
```

---

## Abschluss-Checkliste

- [ ] System-Prompt ist klarer und beschreibt, was der Agent kann
- [ ] `addToBasket`-Tool ist im MCP-Server ergänzt
- [ ] Agent kann Produkte anzeigen UND in den Warenkorb legen
- [ ] Artikel tauchen im Webshop-Frontend (<http://localhost:4200>) im Warenkorb auf

---

## Weiter zur Lösung (`main`)

Der Branch `main` enthält die vollständige Referenzlösung (Agent + MCP-Server mit `requestProductList` und `addToBasket`). Vergleiche deinen Stand damit:

```bash
git checkout -f main
```

> **Hinweis:** `-f` verwirft deine lokalen Änderungen (deine bisherige Lösung). Das ist hier gewollt – der Zielbranch enthält den passenden Stand bereits.
