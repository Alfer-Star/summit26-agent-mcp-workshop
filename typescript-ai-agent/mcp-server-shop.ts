import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getProductList, postBasket } from "./request.js";

const mcp = new FastMCP({
  name: "S&N Webshop",
  version: "1.0.0",
  instructions:
    "Provides tools for interacting with Webshop, like showing products, adding items to the cart and more.",
});

mcp.addTool({
  name: "requestProductList",
  description: "Return product list from S&N Shop.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductList();
    return `products: ${JSON.stringify(result)}`;
  },
});

mcp.addTool({
  name: "addToBasket",
  description: "Add a product to the shopping basket.",
  parameters: z.object({
    productId: z.string().describe('Product ID, e.g. "GAD-001"'),
    quantity: z.number().int().positive().describe("Number of items to add"),
  }),
  execute: async ({ productId, quantity }) => {
    const result = await postBasket(productId, quantity);
    return `basket: ${JSON.stringify(result)}`;
  },
});

mcp.start({
  transportType: "httpStream",
  httpStream: { port: 3010 },
});
