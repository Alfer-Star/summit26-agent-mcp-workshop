import asyncio

from dotenv import load_dotenv

# Läd die Umgebungsvariablen aus der .env-Datei, bzw. den Api Key für das Ki Modell
load_dotenv()

SYSTEM_PROMPT = """
You are a helpful shopping assistant for the S&N Shop.
S&N develops Software for the finance industry, but also has a webshop where Coworker can buy merchandise like t-shirts, hoodies, mugs and more.
You have access to the following tools to help you user interacting with the Workshop:
"""

async def main():
    print('Assistent bereit. "exit" zum Beenden.')
    loop = asyncio.get_running_loop()

    while True:
        user_input = await loop.run_in_executor(None, lambda: input('\nDu: '))
        if user_input.strip().lower() == 'exit':
            break
        if not user_input.strip():
            continue

        response = user_input

        print(f'\nAssistent: {response}')

if __name__ == "__main__":
    asyncio.run(main())