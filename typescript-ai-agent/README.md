# TypeScript AI Agent – Session 1

## Ziel dieser Session

Du startest mit einem leeren Grundgerüst und baust daraus einen funktionierenden KI-Agenten, der über die Konsole mit dir spricht, sich den Gesprächsverlauf merkt und ein eigenes Tool aufrufen kann.

**Startpunkt:** `agent.ts` enthält nur eine einfache Readline-Schleife – kein Modell, keine KI.  
**Ziel:** Der Agent antwortet über Claude, merkt sich den Gesprächsverlauf und ruft bei Bedarf ein selbst definiertes Tool auf.

---

## Vorbereitung (falls nicht über Session_0 bereits geschehen)

Abhängigkeiten installieren und API-Key einrichten (falls noch nicht erledigt):

```bash
npm install
cp .env-example .env
# ANTHROPIC_API_KEY in .env eintragen
```

---

## Aufgaben

### Schritt 1: Aktuellen Stand starten und verstehen

```bash
npm run agent:start
```

Tippe etwas ein – was passiert? (Noch keine echte Antwort, nur `...`)  
Beende mit `exit`.

---

### Schritt 2: KI-Modell anbinden

Öffne `agent.ts` und ergänze Imports, System-Prompt und die `main()`-Funktion.

**Imports ergänzen:**

```typescript
import { createAgent } from 'langchain';
```

**System-Prompt ergänzen** (vor `main()`):

```typescript
const SYSTEM_PROMPT = `
Du bist ein hilfreicher Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.
`;
```

**`main()`-Funktion ersetzen:**

```typescript
async function main() {
  const agent = createAgent({
    model: 'anthropic:claude-sonnet-4-6',
    systemPrompt: SYSTEM_PROMPT,
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Assistant bereit. "exit" zum Beenden.');

  let messages: any[] = [];

  while (true) {
    const userInput = await prompt(rl, '\nDu: ');
    if (userInput.trim().toLowerCase() === 'exit') break;
    if (!userInput.trim()) continue;

    const result = await agent.invoke(
      { messages: [...messages, { role: 'user', content: userInput }] },
    );
    messages = result.messages;

    const answer = result.messages[result.messages.length - 1].content;
    console.log(`\nAssistent: ${answer}`);
  }

  rl.close();
}
```

Starte den Agenten und stelle sicher, dass er auf Fragen antwortet und sich den Gesprächsverlauf merkt.

---

### Schritt 3: Tool als Funktion definieren

Tools sind Funktionen, die der Agent eigenständig aufrufen kann. Definiere ein einfaches Test-Tool direkt in `agent.ts`.

**Imports ergänzen:**

```typescript
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
```

**Tool-Funktion ergänzen** (vor `main()`):

```typescript
const getTestData = tool(
  async () => JSON.stringify({ name: 'Test' }),
  {
    name: 'get_test_data',
    description: 'Gibt Testdaten zurück.',
    schema: z.object({}),
  }
);
```

---

### Schritt 4: Tool an den Agenten übergeben

Ergänze `tools` in `createAgent(...)`:

```typescript
const agent = createAgent({
  model: 'anthropic:claude-sonnet-4-6',
  systemPrompt: SYSTEM_PROMPT,
  tools: [getTestData],
});
```

---

### Schritt 5: Tool testen

Starte den Agenten und frage ihn gezielt nach Testdaten:

```bash
npm run agent:start
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
