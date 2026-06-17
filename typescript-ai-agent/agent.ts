import "dotenv/config";
import * as readline from "readline";

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Assistant bereit. "exit" zum Beenden.');

  while (true) {
    const userInput = await prompt(rl, "\nDu: ");
    if (userInput.trim().toLowerCase() === "exit") break;
    if (!userInput.trim()) continue;

    console.log(`\nAssistent: ...`);
  }

  rl.close();
}

main();
