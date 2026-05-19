import asyncio

from langchain.agents import create_agent
from langchain_mcp_adapters.client import MultiServerMCPClient
from dotenv import load_dotenv
from langchain_mcp_adapters.sessions import Connection

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

async def main():
    client = MultiServerMCPClient(mcp_config)

    tools = await client.get_tools()

    agent = create_agent(
        model="claude-sonnet-4-6",
        tools=tools,
        system_prompt=SYSTEM_PROMPT,
    )

    result = await agent.ainvoke(
        {"messages": [{"role": "user", "content": "What products do you have in your shop?"}]}
    )
    print(result["messages"][-1].content_blocks)

if __name__ == "__main__":
    asyncio.run(main())