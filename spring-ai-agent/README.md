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
* Start das Backend mit der REST Schnittstelle
* Starte das Webfrontend
* Starte zuerst die Spring Boot Anwendung des MCP Servers, danach die des MCP Clients
* Teste den Workflow zum Abruf von Produkten, optional Produkt-Details und lege Produkte in den Warenkorb
* Überprüfe den Warenkorb im Webfrontend (ggf. mit Aktualisierung (F5))

### Überlegungen zur Optimierung und Erweiterung
* Überlege, ob der System Prompt je nach Gesprächsverlauf noch justiert werden sollte:
* * Fall 1 (Geführter Verkauf): Zeige mir zuerst Produktliste ->  zeigen mir Details zu Produkt XXX --> Lege mir das Produkt in den Warenkorb
* + Fall 2 (Delegierter Verkauf): Wähle das bequemste Kleidungsstück und lege es in den Warenkorb
* Überlege, wie das Ganze getestet werden kann

### Finale Lösung : Main Branch