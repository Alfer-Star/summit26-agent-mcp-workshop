# TypeScript AI Agent – Session 1

## Ziel dieser Session

Du startest mit einem leeren Grundgerüst und baust daraus einen funktionierenden KI-Agenten, der über die Konsole mit dir spricht, sich den Gesprächsverlauf merkt und ein eigenes Tool aufrufen kann.

**Startpunkt:** `agent.py` enthält nur eine einfache Readline-Schleife – kein Modell, keine KI.  
**Ziel:** Der Agent antwortet über Claude, merkt sich den Gesprächsverlauf und ruft bei Bedarf ein selbst definiertes Tool auf.

---

## Vorbereitung (falls nicht über Session_0 bereits geschehen)

Öffne den Terminal in python-ai-agent

```bash
cd python-ai-agent
```

Abhängigkeiten installieren und API-Key einrichten (falls noch nicht erledigt):

```bash
uv sync
cp .env-example .env
# ANTHROPIC_API_KEY in .env eintragen
```

---

## Aufgaben

### Schritt 1: Aktuellen Stand starten und verstehen

```bash
uv run agent.py
```

Tippe etwas ein – was passiert? (Noch keine echte Antwort, nur `...`)  
Beende mit `exit`.

---

### Schritt 2: KI-Modell anbinden

Öffne `agent.py` und ergänze Imports, System-Prompt und die `main()`-Funktion.

**Imports ergänzen:**

```python
from langchain.agents import create_agent
```

**System-Prompt ergänzen** (vor `main()`):

```python
SYSTEM_PROMPT = """
You are a helpful shopping assistant for the S&N Shop.
S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more.
You have access to the following tools to help you user interacting with the Workshop:
"""
```

**`main()`-Funktion ersetzen:**

```python
async def main():

    # Create Agent 
    agent = create_agent(
        model="claude-sonnet-4-6",
        system_prompt=SYSTEM_PROMPT,
    )

    print('Assistent bereit. "exit" zum Beenden.')

    # Hold messages history for session
    messages = []

    loop = asyncio.get_running_loop()

    while True:
        user_input = await loop.run_in_executor(None, lambda: input('\nDu: '))

        if user_input.strip().lower() == 'exit':
            break
        if not user_input.strip():
            continue

        # create Message Object
        messages.append({"role": "user", "content": user_input})

        # invoke Agent with message
        result = await agent.ainvoke({"messages": messages})

        # set Message History
        messages = result["messages"]

        last_message = result["messages"][-1]
        response = last_message.content

        print(f'\nAssistent: {response}')
```

Starte den Agenten und stelle sicher, dass er auf Fragen antwortet und sich den Gesprächsverlauf merkt.

---

### Schritt 3: Tool als Funktion definieren

Tools sind Funktionen, die der Agent eigenständig aufrufen kann. Langchain bitte eine einfache Syntax, um Tools aus Python functions zu definieren.  
Definiere ein einfaches Test-Tool direkt in `agent.ts`.

**Imports ergänzen:**

```python
from langchain.tools import tool
```

**Tool-Funktion ergänzen** (vor `main()`):

```python
@tool
def get_test_data(name = "World") -> str:
    """Gibt Testdaten zurück. 

    Args: 
      name: Wird mit "Hello {name}" als Testdaten zurückgegeben
    """
    return f"Hello {name}"
```

---

### Schritt 4: Tool an den Agenten übergeben

Ergänze `tools` in `createAgent(...)`:

```python
agent = create_agent(
        model="claude-sonnet-4-6",
        tools=[get_test_data],
        system_prompt=SYSTEM_PROMPT,
    )
```

---

### Schritt 5: Tool testen

Starte den Agenten und frage ihn gezielt nach Testdaten:

```bash
uv run agent.py
```

Beispielfragen:

- „Ruf mal die Testdaten ab."
- „Was liefert das get_test_data-Tool?"

Der Agent entscheidet selbst, wann er das Tool aufruft, und gibt das Ergebnis in natürlicher Sprache zurück.

---

## Checkliste vor Session 2

- [ ] Agent antwortet auf Fragen via Claude
- [ ] Gesprächsgedächtnis funktioniert (Agent erinnert sich an Namen)
- [ ] `get_test_data`-Tool wird vom Agenten aufgerufen und das Ergebnis ausgegeben

---

## Weiter zu Session 2

In Session 2 verbindest du den Agenten per MCP mit dem Webshop, sodass er echte Produktdaten abrufen kann.
