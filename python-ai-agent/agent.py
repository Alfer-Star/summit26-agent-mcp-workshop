import asyncio
from typing import Any
from uuid import UUID

from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
from dotenv import load_dotenv
import json
import logging

from langchain_core.callbacks import BaseCallbackHandler

# Läd die Umgebungsvariablen aus der .env-Datei, bzw. den Api Key für das Ki Modell
load_dotenv()

SYSTEM_PROMPT = """
You are a helpful shopping assistant for the S&N Shop.

S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more. 

You have access to the following tools to help you user interacting with the Workshop:

"""

mcp_config = {
    "shop": {
        "transport": "http", 
        "url": "http://127.0.0.1:9000/mcp",
    }
}

class ToolDebugHandler(BaseCallbackHandler):
    def __init__(self):
        super().__init__()
        self._tool_names: dict[UUID, str] = {}

    def on_tool_start(self, serialized: dict[str, Any], input_str: str, *, run_id: UUID, **kwargs: Any) -> None:
        tool_name = serialized.get("name", "unknown")
        self._tool_names[run_id] = tool_name
        print(f"[Tool Call] {tool_name} {input_str}")

    def on_tool_end(self, output: Any, *, run_id: UUID, **kwargs: Any) -> None:
        tool_name = self._tool_names.pop(run_id, "unknown")
        print(f"[Tool Result] {tool_name} {output}")


async def main():
    client = MultiServerMCPClient(mcp_config)

    tools = await client.get_tools()

    agent = create_agent(
        model="claude-sonnet-4-6",
        tools=tools,
        system_prompt=SYSTEM_PROMPT,
    )

    print('Assistent bereit. "exit" zum Beenden.')
    messages = []
    loop = asyncio.get_running_loop()

    while True:
        user_input = await loop.run_in_executor(None, lambda: input('\nDu: '))

        if user_input.strip().lower() == 'exit':
            break
        if not user_input.strip():
            continue

        messages.append({"role": "user", "content": user_input})

        result = await agent.ainvoke({"messages": messages},         config={
        "callbacks": [ToolDebugHandler()],
        },)

        messages = result["messages"]

        last_message = result["messages"][-1]
        response = last_message.content
        if isinstance(response, list):
            response = ''.join(
                block.get('text', '') if isinstance(block, dict) else getattr(block, 'text', '')
                for block in response
            )

        print(f'\nAssistent: {response}')

if __name__ == "__main__":
    asyncio.run(main())