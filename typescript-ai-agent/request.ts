import "dotenv/config";

const SHOP_API_BASE = "http://localhost:3000/";

class ShopAuth {
  private token: string | null = null;
  private tokenExpiry = 0;
  userId: number | null = null;

  constructor(
    private email: string,
    private password: string,
  ) {}

  async ensureAuthenticated(): Promise<void> {
    if (this.token && Date.now() < this.tokenExpiry) return;

    const resp = await fetch(SHOP_API_BASE + "auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.email, password: this.password }),
    });

    if (!resp.ok) throw new Error(`Auth failed: ${resp.status}`);

    const data = await resp.json();
    this.token = data.accessToken;
    this.tokenExpiry = Date.now() + (7200 - 60) * 1000;
    this.userId = data.user.id;
  }

  getToken(): string {
    return this.token!;
  }
}

const _auth = new ShopAuth("test@test.de", "password1");

export async function getProductList(
  lang = "de",
  productGroupId?: string,
  searchQuery?: string,
) {
  return _get("products/get", { lang, productGroupId, searchQuery });
}

export async function getProductGroups(lang = "de") {
  return _get("product-groups/get", { lang });
}

export async function postBasket(productId: string, quantity: number) {
  await _auth.ensureAuthenticated();
  return _post("basket/items", {
    userId: _auth.userId,
    productId,
    quantity,
  });
}

async function _get(
  path: string,
  params: Record<string, string | number | undefined>,
) {
  await _auth.ensureAuthenticated();
  const url = new URL(SHOP_API_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  const resp = await fetch(url.toString(), {
    headers: { "x-access-token": _auth.getToken() },
  });
  if (!resp.ok) return null;
  return resp.json();
}

async function _post(path: string, data: Record<string, unknown>) {
  await _auth.ensureAuthenticated();
  const resp = await fetch(SHOP_API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": _auth.getToken(),
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) return null;
  return resp.json();
}
