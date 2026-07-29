import 'dotenv/config';
import * as readline from 'readline';
import { createAgent } from 'langchain';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const SYSTEM_PROMPT = `
Du bist ein hilfreicher Assistent für den S&N Shop.
S&N entwickelt Software für die Finanzbranche und betreibt einen Webshop für Merchandise wie T-Shirts, Hoodies, Tassen und mehr.
`;

const getTestData = tool(
  async () => JSON.stringify({ name: 'Test' }),
  {
    name: 'getTestData',
    description: 'Gibt Testdaten zurück.',
    schema: z.object({}),
  }
);

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const agent = createAgent({
    model: 'anthropic:claude-sonnet-4-6',
    systemPrompt: SYSTEM_PROMPT,
    tools: [getTestData],
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

main();
