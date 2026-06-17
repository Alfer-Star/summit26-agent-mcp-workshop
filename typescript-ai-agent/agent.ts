<<<<<<< HEAD
import 'dotenv/config';
import * as readline from 'readline';
=======
import "dotenv/config";
import * as readline from "readline";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatAnthropic } from "@langchain/anthropic";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import type { Serialized } from "@langchain/core/load/serializable";


class ToolDebugHandler extends BaseCallbackHandler {
  name = "ToolDebugHandler";
  private toolNames = new Map<string, string>();

  async handleToolStart(tool: Serialized, input: string, runId: string) {
    const toolName = (tool.id as string[])?.[tool.id.length - 1] ?? "unknown";
    this.toolNames.set(runId, toolName);
    try {
      console.debug(`[Tool Call] ${toolName}`, JSON.parse(input));
    } catch {
      console.debug(`[Tool Call] ${toolName}`, input);
    }
  }

  async handleToolEnd(output: string, runId: string) {
    const toolName = this.toolNames.get(runId) ?? "unknown";
    this.toolNames.delete(runId);
    console.debug(`[Tool Result] ${toolName}`, output);
  }
}

const SYSTEM_PROMPT = `
You are a helpful shopping assistant for the S&N Shop.

S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more.

You have access to the following tools to help you user interacting with the Workshop:
`;

const mcpConfig = {
  shop: {
    transport: "http" as const,
    url: "http://127.0.0.1:3010/mcp",
  },
};
>>>>>>> 8d7d12f (fixed deprecated version workaround)

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
<<<<<<< HEAD
=======
  const client = new MultiServerMCPClient(mcpConfig);
  const tools = await client.getTools();

  const agent = createReactAgent({
    llm: new ChatAnthropic({
      model: "claude-sonnet-4-6",
    }),
    tools,
    stateModifier: SYSTEM_PROMPT,
  });

>>>>>>> 8d7d12f (fixed deprecated version workaround)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('Assistant bereit. "exit" zum Beenden.');

  while (true) {
    const userInput = await prompt(rl, '\nDu: ');
    if (userInput.trim().toLowerCase() === 'exit') break;
    if (!userInput.trim()) continue;

    console.log(`\nAssistent: ...`);
  }

  rl.close();
}

main();
