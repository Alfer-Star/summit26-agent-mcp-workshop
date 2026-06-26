import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getProductList } from "./request.js";

const mcp = new FastMCP({
  name: "S&N Webshop",
  version: "1.0.0",
  instructions:
    "Provides tools for interacting with Webshop, like showing products and more.",
});

mcp.addTool({
  name: "request_product_list",
  description: "Return product list from S&N Shop.",
  parameters: z.object({}),
  execute: async () => {
    const result = await getProductList();
    return `products: ${JSON.stringify(result)}`;
  },
});

mcp.start({
  transportType: "httpStream",
  httpStream: { port: 3010 },
});
