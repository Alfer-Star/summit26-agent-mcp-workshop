import asyncio

from dotenv import load_dotenv

# Läd die Umgebungsvariablen aus der .env-Datei, bzw. den Api Key für das Ki Modell
load_dotenv()


async def main():
    print("Hello World")

if __name__ == "__main__":
    asyncio.run(main())