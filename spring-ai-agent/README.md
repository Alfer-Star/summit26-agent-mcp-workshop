# README

## Session 1 Ziel

* Modell anbinden
* Agent Tool mit Hello World einbinden (lokal)
* Agent CLI ansprechbar

## Session 2 Ziel (Most Time)

* MCP Schnittstelle für Get Product Liste: `/products/get`
* MCP Tool Signatur erstellen
* MCP als Tool in den Agenten einbauen
* Agenten Testen: Produkte abrufen
* Test

### MCP Client - Konfiguration
* Ergänze folgenden Inhalt in der application.properties Datei
```

```

Die MCP Tool Methoden des MCP Servers werden vom Agenten eingebunden.

### MCP Server - Konfiguration
* Öffne das Maven Modul MCP-Server
* Öffne die Konfigurationsdatei application properties
```application.properties (Ausschnitt)
spring.ai.mcp.server.name=mcp-server-sn-summit
spring.ai.mcp.server.version=0.0.1
spring.ai.mcp.server.protocol=STATELESS
# spring.ai.mcp.server.protocol=STREAMABLE
```
Der MCP Server mit HTTP Streamable Protokoll auf Standard-Port 8080 gestartet.

Das Spring AI Framework bietet hier eine (im Beispiel nicht verwendete) stateful Variante "Streanable" mit Callbacks Option zum Server
und eine "Cloud-Native" kompatible stateless Variante ohne Callbackoption an

### MCP Server Tool
* Öffne die Klasse "Tools"
* Füge die Methode get Products zum Abruf der Produktliste in der Klasse ein:
```Java
@McpTool(description = "Gibt alle Produkte zurück. " +
"Der Parameter 'lang' steuert, welche Sprachvariante von Name, Beschreibung und Detailbeschreibung zurückgegeben wird. " +
"Es kann die Angabe von Produktgruppe oder einem Suchbegriff ergänzt werden, womit die Ausgabe gefiltert wird. " +
"Gibt eine Liste von Objekten mit folgenden Feldern zurück:" +
"- id: Eindeutige Produkt-ID" +
"- imageUrl: Link zum Produktbild" +
"- name: Name des Produkts in der gewählten Sprache" +
"- description: Kurzbeschreibung des Produkts in der gewählten Sprache.")
public List<ProductRecord> getProducts(
@McpToolParam(description = "Die Sprachvariante von Name, Beschreibung und Detailbeschreibung") String lang,
@McpToolParam(description = "Nur optional: Filtert Ergebnisse auf eine Produktgruppe") String productGroupId,
@McpToolParam(description = "Nur optional: Filter Ergebnisse nach Suchbegriff auf Produktname und Produktbeschreibung") String searchQuery) {

		System.out.println("MCP Server: Aufruf Tool Methode getProducts: Language=" + lang + " Produktgruppe=" + productGroupId +  " Suchbegriff=" + searchQuery);

		List<ProductRecord> listProducts = fetchProducts(lang, productGroupId, searchQuery);

		System.out.println("CP Server: Ergebnis Tool Methode getProducts: " + listProducts.toString());
		return listProducts;

	}
```

Die Tool Methode ist für den MCP CLient verfügbar.

Für Input- und Outputparameter sind Beschreibungen zur Auswertung für das KI-Modell vorhanden.

### Test des Agenten mit dem MCP Server
* Öffne ein Terminal und starte das Backend mit der REST Schnittstelle
```
npm install
npm run server:start      # Starts Express on port 3000
 ```
* Starte das Webfrontend
* Starte zuerst die Spring Boot Anwendung des MCP Servers, danach die des MCP Clients
* Teste den Workflow zum Abruf von Produkten, optional Produkt-Details und lege Produkte in den Warenkorb
* Überprüfe den Warenkorb im Webfrontend (ggf. mit Aktualisierung (F5))


## Session 3 
### Vorbereitung
Lade den git Branch in ein lokales Verzeichnis:
* git clone -b session_3_agent_mcp_conn
ect https://<username>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-wo
rkshop.git

### Hinzufügen weiterer MCPTools Methoden im MCP Server
* Öffne die Klasse Tools im Maven Modul MCP-Server
* Füge eine MCPTool Methode "getProductDetails" hinzu.
* * Leite hier zur Abfrage von Details eines Produkts den REST Aufruf in der vorhandene Methode "fetchProductDetails" weiter.
* * Verwende die Datenstruktur "SingleProductResponse" als Rückgabe
* * Beschreibe im "description" Attribut der Methode und der Eingabeparameter verständlich die Bedeutung der Attribute der Ein- und Ausgabestruktur

* Füge eine weitere MCPTool Methode "addToBasket" hinzu.
* * Leite hier für das Einstellen eines Produktes in den Warenkorbs den REST Aufruf in der vorhandenen Methode "addItemToBasket" weiter.
* * Verwende die Datenstruktur BasketItemRequest als Eingabe und die Datenstruktur BasketItemResponse als Rückgabe.
* * Beschreibe im "description" Attribut der Methode und der Eingabeparameter verständlich die Bedeutung der Attribute der Ein- und Ausgabestruktur

### Erweiterung des System Prompts im MCP Client
* Erweitere die System Prompt Beschreibung, dass der Kunde ausser der Abfrage der Produktliste Produktdetails anzeigen und ausgewählte Artikel in den Warenkorb legen kann
* Weise den Kunden nach Befüllen des Warenkorbes darauf hin, dass der Verkauf und das Bezahlen nur in der Weboberfläche des Verkaufsportals möglich ist
 

### Test des Agenten
* Öffne ein Terminal und starte das Backend mit der REST Schnittstelle
```
npm install
npm run server:start      # Starts Express on port 3000
 ```
* Öffne ein weiteres Terminal und starte das Webfrontend
```
npm install
npm run client:start                      # Dev server on port 4200
npm run client:build                      # Production build
npm run client:lint                       # ESLint + Prettier
npm run client:test                       # Vitest (headless)
npm run client:test:browser               # Vitest in Chromium
npm run client:test:browser:headless      # Vitest in headless Chromium
```
* Starte zuerst die Spring Boot Anwendung des MCP Servers, danach die des MCP Clients
* Teste den Workflow zum Abruf von Produkten, optional Produkt-Details und lege Produkte in den Warenkorb
* Überprüfe den Warenkorb im Webfrontend (ggf. mit Aktualisierung (F5))

### Überlegungen zur Optimierung und Erweiterung
* Überlege, ob der System Prompt je nach Gesprächsverlauf noch justiert werden sollte:
* * Fall 1 (Geführter Verkauf): Zeige mir zuerst Produktliste ->  zeigen mir Details zu Produkt XXX --> Lege mir das Produkt in den Warenkorb
* + Fall 2 (Delegierter Verkauf): Wähle das bequemste Kleidungsstück und lege es in den Warenkorb
* Überlege, wie das Ganze getestet werden kann

## Finale Lösung : Main Branch