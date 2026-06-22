# README

## Session 1
### Ziel
Ziel der Session ist es, einen KI Agenten zu erstellen, ein Modell anzubinden und ein lokales Tool für das Lesen einer Produktliste zu erstellen.

Der Agent soll auf der Konsole ansprechbar sein und mit dem Benutzer interagieren.

### Vorbereitung Session 1
* Lade den git Branch in ein lokales Verzeichnis:
* git clone -b session_1_agent https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop

### Entwicklung

### Test
* Starte im Maven Modul MCP-CLient die Applikations-Klasse in der IDE
* Öffne alternativ in der Konsole das Verzeichnis MCP-Client und führe "mvn spring-boot:run" aus.


## Session 2

### Ziel
Ziel der Session ist es, einen MCP Server an den bestehenden Agenten anzubinden 
und dort eine erste Tool Schnittstelle zum Lesen einer Produktliste zu erstellen und anzubinden.

Für die Schnittstelle ist passend zum vorhandenen Rest-Aufruf eine Signatur zu erstellen.

Der Agenten-Workflow ist anschließend inhaltlich zu testen und ggf. der System Prompt anzupassen.
Hierbei kann per Log-Level-Einstellung auch die MCP-Client-Server-Kommunikation analysiert werden.

### Vorbereitung Session 2
* Lade den git Branch in ein lokales Verzeichnis:
* git clone -b session_2_mcp https://<user>:<token>@git.s-und-n.de/aalfermann/summit-26-agent-workshop
exit### MCP Client - Anpassung Agent
* Ändere den System Prompt wie folgt:
```
"""Du bist ein autonomer Einkaufs-Agent für ein Online-Portal.
Der Benutzer beauftragt dich, passende Produkte zu suchen und in den Warenkorb zu legen. und ggf. Verkauf abzuschließen.
Der Verkauf (Checkout) erfolgt nicht hier, sondern über die Portal-Oberfläche

WICHTIG FÜR DIE Einstellung von Produkten in den Warenkorb:
Nutze die folgenden hinterlegten Benutzerdaten:
- User ID: %s

Falls du für eine Aufgabe wichtige Informationen benötigst (z.B. Lieferadresse, Größe, Farbe),
stelle gezielte Rückfragen an den Benutzer, bevor du fortfährst.
""".formatted(apiUserId);
```
* Passe die Chat Client Initialisierung wie folgt an:
* * Hinzufuegen: .defaultToolCallbacks(toolCallbackProvider) // Wird für serverseitige Tools auf Basis der Konfiguration benoetigt
* * Entfernen: .defaultTools(localProductTools) //Das lokale Tool wird nicht mehr benoetigt

```
ChatClient chatClient = chatClientBuilder
.defaultToolCallbacks(toolCallbackProvider) // Hinzufuegen! Wird für serverseitige Tools auf Basis der Konfiguration benoetigt
.defaultAdvisors(MyLoggingAdvisor.builder()
.showConversationHistory(true)
.build())
.defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
.build();
```
* Lösche die Injizierung der Klasse LocalProductTools
```
* @Autowired
  private LocalProductTools localProductTools;
```
* ... und lösche auch die Klasse LocalProductTools, da lokale Tools nicht mehr benötigt werden.

### MCP Client - Konfiguration
* Ergänze folgenden Inhalt in der application.properties Datei
```
# spring.ai.mcp.client.sse.connections.shop-server.url=http://localhost:8080
spring.ai.mcp.client.streamable-http.connections.shop-server.url=http://localhost:8080

logging.level.io.modelcontextprotocol.client=WARN
logging.level.io.modelcontextprotocol.spec=WARN
```

Die MCP Tool Methoden des MCP Servers werden vom Agenten eingebunden.

### MCP Server Konfiguration 
* Öffne das Maven Modul MCP-Server
* Öffne die Konfigurationsdatei application properties
```application.properties (Ausschnitt)
spring.ai.mcp.server.name=mcp-server-sn-summit
spring.ai.mcp.server.version=0.0.1
spring.ai.mcp.server.protocol=STATELESS
# spring.ai.mcp.server.protocol=STREAMABLE
```
* Der MCP Server mit HTTP Streamable Protokoll auf Standard-Port 8080 gestartet.

* Das Spring AI Framework bietet hier eine (im Beispiel nicht verwendete) stateful Variante "Streanable" mit Callbacks Option zum Server
und eine "Cloud-Native" kompatible stateless Variante ohne Callbackoption an

### MCP Server Tools
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

		System.out.println("MCP Server: Ergebnis Tool Methode getProducts: " + listProducts.toString());
		return listProducts;

	}
```

Die Tool Methode ist nun für den MCP Client verfügbar.
Für Input- und Outputparameter sind Beschreibungen zur Auswertung für das KI-Modell vorhanden.

### (Optional) Test des MCP Servers mit MCP Inspector (Anthropic)
* Installiere den MCP Inspector (Node.js vorausgesetzt) ```npx @modelcontextprotocol/inspector```
* (Nach Start des Browsers) Wähle Transport Type "Streamable HTTP"
* (Falls nicht eingestellt) Setze URL ```http://localhost:8080/mcp```
* Verbinde Dich mit dem Server
* Zeige die verfügbaren Tools an (Menü "Resources" oder "Tools")

### Test des Agenten (MCP Client) mit dem MCP Server
* Öffne ein Terminal und starte das Backend mit der REST Schnittstelle
```
npm install
npm run server:start      # Starts Express on port 3000
 ```
* Starte zuerst die Spring Boot Anwendung des MCP Servers, danach die des MCP Clients
* Teste den Workflow zum Abruf von Produkten.

### Überprüfe die MCP Kommunikation zwischen MCP Client und Server
* Ändere den Log-Level in der MCP Client Datei "application.properties"
```
logging.level.io.modelcontextprotocol.client=TRACE
logging.level.io.modelcontextprotocol.spec=TRACE
```
*  Verfolge die Reihenfolge der MCP Methoden Aufrufe
* * "Sending message for method initialize"
* * "Sending message for method tools/list"
* * "Sending message for method tools/call"

## Session 3 
Ziel dieser Session ist es, über den Agenten Workflow via MCP Server Tool Schnittstellen 
ein oder mehrere Produkte auszuwählen und für den Benutzer mit der ID 1 in den Einkaufswagen zu legen. 

Es werden folgende Tool Schnittstellen verwendet:
* Produkteliste lesen
* Produktdetails lesen
* Produkt in Einkaufswagen legen

Im Webshop kann danach der Warenkorb angesehen und der Verkauf gestartet werden.


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
* Starte zuerst die Spring Boot Anwendung des MCP Servers, danach die des MCP Clients
* Teste den Workflow zum Abruf von Produkten, optional Produkt-Details und lege Produkte in den Warenkorb
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
* Melde Dich im Webfrontend mit Username "test@test.de" und Passwort "password1" an
* Überprüfe den Warenkorb im Webfrontend (ggf. mit Aktualisierung (F5)) und starte dort den Verkauf

### Überlegungen zur Optimierung und Erweiterung
* Überlege, ob der System Prompt je nach Gesprächsverlauf noch justiert werden sollte:
* * Fall 1 (Geführter Verkauf): Zeige mir zuerst Produktliste ->  zeigen mir Details zu Produkt XXX --> Lege mir das Produkt in den Warenkorb
* + Fall 2 (Delegierter Verkauf): Wähle das bequemste Kleidungsstück und lege es in den Warenkorb
* Überlege, wie das Ganze getestet werden kann

## Finale Lösung : Main Branch