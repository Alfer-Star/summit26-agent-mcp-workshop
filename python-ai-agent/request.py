import httpx

SHOP_API_BASE = "http://localhost:3000/"  # Base URL for the S&N Shop API

async def get_product_list(lang="de", **kwargs) -> dict | None:
    """Make a request to the S&N Shop API /products/get.
    Get all Products if no parameters are provided, otherwise filter by productGroupId and search by searchQuery.

    Args:
        data (dict): API parameter as Key Value pairs.  productGroupId (Example: "GAD-001"), searchQuery (Example: "Hoodie").
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "products/get"
    data = {
        "lang": lang,
        "productGroupId": kwargs.get("productGroupId"),
        "searchQuery": kwargs.get("searchQuery"),
    }

    return await _get_request(path, data)


async def get_product(productId: str, lang="de") -> dict | None:
    """Make a request to the S&N Shop API /products/get-product.
    Get a specific product by its ID.

    Args:
        productId (str): Concatination of group and number, example "GAD-001"
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "products/get-product"
    data = {"lang": lang, "productId": productId}

    return await _get_request(path, data)

async def get_basket(lang="de") -> dict | None:
    """Make a request to the S&N Shop API /basket.
    Get the current shopping basket.

    Args:
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "basket"
    data = {"lang": lang}

    return await _get_request(path, data)

async def signin(email = "test@test,de", password = "password1") -> dict | None:
    """Make a request to the S&N Shop API /signin.
    Sign in to the shop.

    Args:
        email (str): default is Testuser, See /initial-data/initial-user.js for cred
        password (str): default is Testuser, See /initial-data/initial-user.js for cred

    Returns:
        dict | None: return jwt token if successful, otherwise None.
    """
    path = "signin"
    data = {"email": email, "password": password}

    return await _post_request(path, data)

async def post_basket(productId: str, quantity: int, lang="de") -> dict | None:
    """Make a request to the S&N Shop API /basket.
    Add an item to the shopping basket.

    Args:
        productId (str): Concatination of group and number, example "GAD-001" 
        quantity (int) 
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "basket"
    data = {"lang": lang, "productId": productId, "quantity": quantity}

    return await _post_request(path, data)

async def post_checkout() -> dict | None:
    """Make a request to the S&N Shop API /checkout.
    Checkout the current shopping basket and create an order.

    Args:
        lang (str): de or en, default is de.

    Returns:
        dict | None: The ordered Products as List, otherwise None.
    """
    path = "checkout"
    data = {}

    return await _post_request(path, data)

async def delete_from_basket(productId: str) -> dict | None:
    """Make a delete request to the S&N Shop API /basket.
    Remove an item from the shopping basket.

    Args:
        productId (str): Concatination of group and number, example "GAD-001"
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "basket/items"
    params = {"productId": productId}

    return await _delete_request(path, params)

async def clear_basket() -> dict | None:
    """Make a delete request to the S&N Shop API /basket.

    Args:
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    path = "basket"

    return await _delete_request(path)




"""============ Request Helper ================"""


async def _get_request(path: str, data: dict) -> dict | None:
    """Make a GET request to the S&N Shop API."""
    return await _request('GET', path, data)

async def _post_request(path: str, data: dict) -> dict | None:
    """Make a POST request to the S&N Shop API."""
    return await _request('POST', path, data)

async def _delete_request(path: str, data: dict={}) -> dict | None:
    """Make a DELETE request to the S&N Shop API."""
    return await _request('DELETE', path, data)
        
async def _request(method:str, path: str, data: dict) -> dict | None:
    """Make a GET request to the S&N Shop API."""
    auth = httpx.BasicAuth(username="test@test,de", password="password1")
    async with httpx.AsyncClient(auth=auth) as client:
        try:
            response = await client.request(method, SHOP_API_BASE + path, params=data, timeout=30.0)
            response.raise_for_status()
            return response.json()
        except Exception:
            return None

""" #Tests
import asyncio
print("=====================Get Product List=====================")
print(asyncio.run(get_product_list()))
print("==================Get Product with ID 1: ====================")
print(asyncio.run(get_product("GAD-001")))
print("====================Get Shopping Basket=====================")
print(asyncio.run(get_basket()))
print("=====================Add Item to Basket=====================")
print(asyncio.run(post_basket("GAD-001", 2)))
print(asyncio.run(post_basket("GAD-002", 1)))
print("====================Get Shopping Basket=====================")
print(asyncio.run(get_basket()))
print("=====================Remove Item from Basket=====================")
print(asyncio.run(delete_from_basket("GAD-001")))
print("====================Get Shopping Basket=====================")
print(asyncio.run(get_basket()))
print("=====================Clear Basket=====================")
print(asyncio.run(clear_basket()))
print("=====================Add Item to Basket=====================")
print(asyncio.run(post_basket("GAD-001", 2)))
print("=====================Checkout=====================")
print(asyncio.run(post_checkout())) """
