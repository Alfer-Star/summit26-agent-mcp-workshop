---
title: TypeScript AI Agent — Workshop Reference Implementation
date: 2026-06-10
status: approved
---

# TypeScript AI Agent — Workshop Reference Implementation

## Context

Workshop mit 3 Sprachen (Python, TypeScript, Java). Python-Referenzcode in `python-ai-agent/`. Diese Spec beschreibt die TypeScript-Entsprechung in `typescript-ai-agent/`. Der Code im Repo ist immer die vollständige Lösung; Starter-Skelette werden separat an Teilnehmer verteilt.

## Verzeichnisstruktur

```
typescript-ai-agent/
  agent.ts              # Teil 1: LangChain-Agent mit MCP-Client
  mcp-server-shop.ts    # Teil 2 & 3: fastmcp-MCP-Server
  request.ts            # HTTP-Client mit JWT-Auth gegen Shop-API (localhost:3000)
  package.json
  .env-example
  .gitignore
```

## npm Scripts

```json
{
  "agent:start": "tsx agent.ts",
  "mcp:start":   "tsx mcp-server-shop.ts"
}
```

Laufzeit: `tsx` (dev-Dependency), kein Build-Schritt.

## Abhängigkeiten

| Paket | Zweck |
|---|---|
| `@langchain/langgraph` | `createReactAgent` |
| `@langchain/anthropic` | `ChatAnthropic` |
| `@langchain/mcp-adapters` | `MultiServerMCPClient` |
| `fastmcp` | MCP-Server-Framework |
| `zod` | Parameter-Schemas für MCP-Tools |
| `dotenv` | `.env` laden |
| `tsx` (dev) | TypeScript direkt ausführen |
| `typescript` (dev) | Typen |

## Datei-Beschreibungen

### `request.ts`

1:1-Port von `request.py`. Verwendet native `fetch` (Node 18+).

- `ShopAuth` — Klasse mit Email/Passwort-Login, Token-Caching (2h TTL minus 60s Puffer). Setzt `x-access-token`-Header.
- `getProductList(lang?, productGroupId?, searchQuery?)` — GET `/products/get`
- `getProductGroups(lang?)` — GET `/product-groups/get`
- `postBasket(productId, quantity)` — POST `/basket/items`
- Interne Hilfsfunktionen `_get`, `_post`

Singleton `_auth = new ShopAuth("test@test.de", "password1")`.

### `mcp-server-shop.ts`

FastMCP-Server auf Port 9000, HTTP-Transport. Tools:

| Tool | Beschreibung | Teil |
|---|---|---|
| `request_product_list` | Alle Produkte abrufen | Teil 2 |
| `request_product_groups` | Alle Produktgruppen abrufen | Teil 2 |
| `add_to_basket` | Produkt in Warenkorb legen (productId + quantity) | Teil 3 |

### `agent.ts`

LangChain-Agent mit `createReactAgent`, `ChatAnthropic` (Modell: `claude-sonnet-4-6`), `MultiServerMCPClient`.

MCP-Config:
```ts
{ shop: { transport: "streamable_http", url: "http://127.0.0.1:9000/mcp" } }
```

System-Prompt: identisch zu Python-Referenz (S&N Shopping Assistant).
Beispiel-Query: `"What products do you have in your shop?"`
Ausgabe: letztes Message-Content auf der Konsole.

## Workshop-Phasen

| Teil | Aufgabe der Teilnehmer |
|---|---|
| 1 | Basis-App erhalten; LLM via LangChain anbinden (`agent.ts` vervollständigen) |
| 2 | `mcp-server-shop.ts` bauen mit `request_product_list` + `request_product_groups` |
| 3 | MCP in Agent aus Teil 1 einbinden; Tool `add_to_basket` ergänzen |

## Nicht im Scope

- Checkout (`post_checkout`)
- Warenkorb löschen (`delete_from_basket`, `clear_basket`)
- Produktdetail (`get_product`)
- Interaktiver Chat-Loop (einzelner `invoke`-Call wie Python-Referenz)
