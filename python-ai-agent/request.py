import time
import httpx

SHOP_API_BASE = "http://localhost:3000/"


class ShopAuth(httpx.Auth):
    def __init__(self, email: str, password: str):
        self._email = email
        self._password = password
        self._token: str | None = None
        self._token_expiry: float = 0.0
        self.user_id: int | None = None

    async def ensure_authenticated(self) -> None:
        if self._token and time.time() < self._token_expiry:
            return
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                SHOP_API_BASE + "auth/signin",
                json={"email": self._email, "password": self._password},
                timeout=30.0,
            )
            resp.raise_for_status()
            data = resp.json()
            self._token = data["accessToken"]
            self._token_expiry = time.time() + 7200 - 60
            self.user_id = data["user"]["id"]

    async def async_auth_flow(self, request):
        await self.ensure_authenticated()
        request.headers["x-access-token"] = self._token
        yield request


_auth = ShopAuth("test@test.de", "password1")


async def get_product_list(lang="de", **kwargs) -> dict | None:
    """Make a request to the S&N Shop API /products/get.
    Get all Products if no parameters are provided, otherwise filter by productGroupId and search by searchQuery.

    Args:
        lang (str): de or en, default is de.
        productGroupId (str): Example "GAD-001".
        searchQuery (str): Example "Hoodie".

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _get_request("products/get", {
        "lang": lang,
        "productGroupId": kwargs.get("productGroupId"),
        "searchQuery": kwargs.get("searchQuery"),
    })

async def getProductGroups(lang = "de"):
    """Make a request to the S&N Shop API /product-groups/get.
    Get all Products groups.

    Args:
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _get_request("product-groups/get", { "lang": lang });



async def get_product(productId: str, lang="de") -> dict | None:
    """Make a request to the S&N Shop API /products/get-product.
    Get a specific product by its ID.

    Args:
        productId (str): Concatination of group and number, example "GAD-001"
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _get_request("products/get-product", {"lang": lang, "productId": productId})


async def get_basket(lang="de") -> dict | None:
    """Make a request to the S&N Shop API /basket.
    Get the current shopping basket.

    Args:
        lang (str): de or en, default is de.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _get_request("basket", {"lang": lang})


async def post_basket(productId: str, quantity: int) -> dict | None:
    """Make a request to the S&N Shop API /basket/items.
    Add an item to the shopping basket.

    Args:
        productId (str): Concatination of group and number, example "GAD-001"
        quantity (int)

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    await _auth.ensure_authenticated()
    return await _post_request("basket/items", {
        "userId": _auth.user_id,
        "productId": productId,
        "quantity": quantity,
    })


async def post_checkout() -> dict | None:
    """Make a request to the S&N Shop API /checkout.
    Checkout the current shopping basket and create an order.

    Returns:
        dict | None: The ordered products as a list, otherwise None.
    """
    return await _post_request("checkout", {})


async def delete_from_basket(productId: str) -> dict | None:
    """Make a delete request to the S&N Shop API /basket/items/{productId}.
    Remove an item from the shopping basket.

    Args:
        productId (str): Concatination of group and number, example "GAD-001"

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _delete_request(f"basket/items/{productId}")


async def clear_basket() -> dict | None:
    """Make a delete request to the S&N Shop API /basket.
    Clear all items from the shopping basket.

    Returns:
        dict | None: The JSON response from the API or None if an error occurs.
    """
    return await _delete_request("basket")


"""============ Request Helper ================"""


async def _get_request(path: str, data: dict) -> dict | None:
    return await _request("GET", path, data)


async def _post_request(path: str, data: dict) -> dict | None:
    return await _request("POST", path, data)


async def _delete_request(path: str) -> dict | None:
    return await _request("DELETE", path, {})


async def _request(method: str, path: str, data: dict) -> dict | None:
    async with httpx.AsyncClient(auth=_auth) as client:
        try:
            if method == "GET":
                response = await client.request(method, SHOP_API_BASE + path, params=data, timeout=30.0)
            else:
                response = await client.request(method, SHOP_API_BASE + path, json=data, timeout=30.0)
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
"""
