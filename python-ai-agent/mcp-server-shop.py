# Fast MCP: https://gofastmcp.com/servers/server
# MCP Prtokoll io: https://modelcontextprotocol.io/docs/develop/build-server

from fastmcp import FastMCP

from request import get_product_list, get_product, get_basket, post_basket

mcp = FastMCP(
    "S&N Webshop",
    instructions="Provides tools for interacting with Webshop, like shwoing products, adding items to the cart and more.",
)

@mcp.tool
async def request_product_list() -> str:
    """Return product list from S&N Shop."""
    result = await get_product_list()
    return f'products: {result}'

def main():
    # Initialize and run the server
    mcp.run(transport="http", host="127.0.0.1", port=9000)
    
if __name__ == "__main__":
    main()

