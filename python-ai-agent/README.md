# Python AI Agent mit MCP – Session 3

## Ziel dieser Session

Der Agent kann am Ende von Session 2 Produkte abrufen – aber noch keine Produktgruppen abfragen und nichts in den Warenkorb legen. In dieser Session fügst du die zwei fehlenden Tools hinzu.

**Startpunkt:** Agent + MCP-Server mit einem Tool (`request_product_list`) aus Session 2.  
**Ziel:** `request_product_groups` und `add_to_basket` im MCP-Server registrieren.

---

## Vorbereitung

### 1. Repository laden (Branch: `session_3_agent_mcp_connect`)

```bash
git checkout session_3_agent_mcp_connect
cd summit-26-agent-workshop/python-ai-agent
```

### 2. Relevante Dateien

```
python-ai-agent/
├── mcp-server-shop.py    ← Hier werden die neuen Tools ergänzt
├── request.py            ← Hilfsfunktionen bereits vorhanden (kein Änderungsbedarf)
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

In `request.tpy` ist `getProductGroups()` bereits vorhanden. Registriere das Tool in `mcp-server-shop.py`:

```python
from request import getProductGroups


```

```python
@mcp.tool()
async def request_product_groups() -> str:
    """Return all product groups from S&N Shop."""
    result = await get_product_groups()
    return f'product groups: {result}'
```

---

### Schritt 2: Warenkorb-Tool hinzufügen

`postBasket()` in `request.ts` ist ebenfalls schon vorhanden. Ergänze den Import und füge das Tool hinzu:

```python
from request import get_product_list, request_product_groups, get_product, get_basket, post_basket

```

Wie dir bestimmt schon aufgefallen ist: FastMCP wandelt Python-Funktionen in MCP-Tools um, indem es die Signatur und die Typangaben der Funktion analysiert. Deshalb nutzen wir den Doc String der Funktion als Aufrufbeschreibung.  

```python
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

---

### Schritt 3: Alles starten und testen

Öffne zwei Terminals:

**Terminal 1 – MCP-Server:**

```bash
cd python-ai-agent && uv run mcp-server-shop.py
```

**Terminal 2 – Agent:**

```bash
cd python-ai-agent && uv run agent.py
```

Teste den vollständigen Einkaufs-Workflow:

1. "In welchen Kategorien gibt es Produkte?"
2. "Welche Hoodies habt ihr?"
3. "Lege einen Hoodie in meinen Warenkorb."
4. Öffne den Webshop unter `http://localhost:4200` und prüfe, ob der Artikel im Warenkorb erscheint.

---

### Schritt 4: (Optional) MCP-Kommunikation verfolgen

Der `ToolDebugHandler` in `agent.py` zeigt im Terminal, welche Tools der Agent aufruft:

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
