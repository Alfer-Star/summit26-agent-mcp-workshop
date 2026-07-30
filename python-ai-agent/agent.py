import asyncio

from langchain.agents import create_agent
from dotenv import load_dotenv
from langchain.tools import tool

# Läd die Umgebungsvariablen aus der .env-Datei, bzw. den Api Key für das Ki Modell
load_dotenv()

SYSTEM_PROMPT = """
You are a helpful shopping assistant for the S&N Shop.
S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more.
You have access to the following tools to help you user interacting with the Workshop:
"""

@tool
def get_test_data(name = "World") -> str:
    """Gibt Testdaten zurück. 

    Args: 
      name: Wird mit "Hello {name}" als Testdaten zurückgegeben
    """
    return f"Hello {name}"

async def main():
    agent = create_agent(
        model="claude-sonnet-4-6",
        tools=[get_test_data],
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

        result = await agent.ainvoke({"messages": messages})

        messages = result["messages"]

        last_message = result["messages"][-1]
        response = last_message.content

        print(f'\nAssistent: {response}')

if __name__ == "__main__":
    asyncio.run(main())