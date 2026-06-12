/*
* Copyright 2025 - 2025 the original author or authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* https://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
package com.demo.mcp_example;

import java.time.LocalDateTime;
import java.util.List;

import io.modelcontextprotocol.spec.McpSchema.TextContent;

import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.ai.mcp.annotation.context.McpSyncRequestContext;
import org.springframework.ai.model.ModelOptionsUtils;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import tools.jackson.databind.ObjectMapper;

/**
 * @author Jochen Kirchner
 */
@Service
public class Tools {

	private final RestClient restClient = RestClient.create();
	private final ObjectMapper objectMapper = new ObjectMapper();

	@McpTool(description = "Gib eine Liste von Produktgruppen zurück")
	public List<ProductGroupRecord> getProductGroups(
			 @McpToolParam(description = "Die Sprachvariante des Produktnames") String lang) {

		System.out.println("MCP Server: Aufruf Tool Methode getProductGroups");
		/**
		List<ProductGroupRecord> listProductGroups = restClient.get()
				.uri("http://localhost:3000/product-groups/get?lang={lang}", lang)
				.retrieve()
				.body(new ParameterizedTypeReference<List<ProductGroupRecord>>() {});

		return listProductGroups;
		**/

		//Falls zu Testzwecken benötigt:
		return List.of(
				new ProductGroupRecord(
						new ProductGroupRecord.ProductGroup("1", "https://example.com/img1.png", "Elektronik")
				),
				new ProductGroupRecord(
						new ProductGroupRecord.ProductGroup("2", "https://example.com/img2.png", "Kleidung")
				)
		);

	}

	public record ProductGroupRecord(ProductGroup productGroup) {
		public record ProductGroup(String id, String imageUrl, String name) {
		}
	}

	//Returns all products, optionally filtered by product group and/or a search query. The lang parameter controls which language variant of name, description, and detailedDescription is returned.
	//productGroupId and searchQuery can be combined.
	//The search is a case-sensitive substring match on both name and description.
	@McpTool(description = "Gibt alle Produkte zurück." +
			"Der Parameter „lang“ steuert, welche Sprachvariante von Name, Beschreibung und Detailbeschreibung zurückgegeben wird." +
			"Nur optional ist due Angabe von Produktgruppe oder einem Suchbegriff notwendig, womit die Ausgabe gefiltert wird. ")
	public List<ProductRecord> getProducts(
			@McpToolParam(description = "Die Sprachvariante von Name, Beschreibung und Detailbeschreibung") String lang,
			@McpToolParam(description = "Nur optional: Filtert Ergebnisse auf eine Produktgruppe") String productGroupId,
			@McpToolParam(description = "Nur optional: Filter Ergebnisse nach Suchbegriff auf Produktname und Produktbeschreibung") String searchQuery) {

		System.out.println("MCP Server: Aufruf Tool Methode getProducts: Language=" + lang + " Produktgruppe=" + productGroupId +  " Suchbegriff=" + searchQuery);

		// Dynamischer Aufbau der URI inklusive der optionalen Query-Parameter
		String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/products/get")
				.queryParam("lang", lang)
				//.queryParamIfPresent("productGroupId", java.util.Optional.ofNullable(productGroupId))
				//.queryParamIfPresent("searchQuery", java.util.Optional.ofNullable(searchQuery))
				.toUriString();

		// REST-Aufruf mit dem korrekten Ziel-Typ (ProductRecord)
		List<ProductRecord> listProducts = restClient.get()
				.uri(uri)
				.retrieve()
				.body(new ParameterizedTypeReference<List<ProductRecord>>() {});


		/*
		// Falls zu Testzwecken benötigt (angepasst an die OpenAPI-Spezifikation):
		List<ProductRecord> listProducts = List.of(
				new ProductRecord(
                   new ProductRecord.Product(
                       "prod-001",
                       "https://example.com/images/prod-001.jpg",
                       4.3f,
                       29.99f,
                       150,
                       3,
                       "Wooden Chair",
                       "Comfortable and durable wooden chair.",
                       "Hand-crafted from solid oak wood..."
                   )
             ),
             new ProductRecord(
                   new ProductRecord.Product(
                       "prod-002",
                       "https://example.com/images/prod-002.jpg",
                       4.8f,
                       599.00f,
                       12,
                       5,
                       "Smart TV",
                       "4K Ultra HD Smart TV",
                       "Experience stunning visuals with the latest OLED technology..."
                   )
             )
        );
		*/

		System.out.println("MCP Server: Ergebnis Tool Methode getProducts: " + listProducts.toString());
		return listProducts;

	}

	public record ProductRecord(
			String id,
			String imageUrl,
			String name,
			String description
	) {}

	@McpTool(description = "Hole die Details zu einem spezifischen Produkt anhand seiner ID. " +
			"Gibt ein Objekt mit folgenden Feldern zurück: " +
			"- id: Eindeutige Produkt-ID\n" +
			"- imageUrl: Link zum Produktbild\n" +
			"- rating: Bewertung von 0.0 bis 5.0\n" +
			"- price: Preis in Euro\n" +
			"- availableQuantity: Lagerbestand\n" +
			"- deliveryDuration: Lieferzeit in Tagen\n" +
			"- detailedDescription: Ausführliche Kursinhalte und Details.")
	public SingleProductResponse getProductDetails(
			@McpToolParam(description = "Die eindeutige ID des Produkts (z.B. prod-001)") String productId,
			@McpToolParam(description = "Die Sprachvariante (z.B. de oder en)") String lang) {

		System.out.println("MCP Server: Aufruf Tool Methode getProductDetails. Produkt ID: " + productId + " Sprache: " +  lang);

		// Dynamischer Aufbau der URI: http://localhost:3000/products/get-product?productId=...&lang=...
		String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/products/get-product")
				.queryParam("productId", productId)
				.queryParam("lang", lang)
				.toUriString();

		// Ausführen des GET-Requests analog zum Curl-Befehl

		SingleProductResponse singleProduct = restClient.get()
				.uri(uri)
				.header("accept", MediaType.APPLICATION_JSON_VALUE) // -H 'accept: application/json'
				.retrieve()
				.body(SingleProductResponse.class); // Automatisches Mapping in den Record

		System.out.println("MCP Server: Rückgabe Tool Methode getProductDetails: " + singleProduct.toString());
		return singleProduct;
	}

	public record SingleProductResponse(
			String id,
			String imageUrl,
			double rating,
			double price,
			int availableQuantity,
			int deliveryDuration,
			String name,
			String description,
			String detailedDescription
	) {}

	@McpTool(description = "Authentifiziert den Benutzer und gibt einen Bearer Token zurück, der für geschützte Aktionen wie den Checkout erforderlich ist.")
	public LoginResponse login(
			@McpToolParam(description = "Der Benutzername für den API-Zugang") String username,
			@McpToolParam(description = "Das Passwort für den API-Zugang") String password) {

		System.out.println("MCP Server: Aufruf Tool Methode login. Username: " + username + " Passwort: " +  password);

		LoginResponse authResponse = restClient.post()
             .uri("http://localhost:3000/auth/signin")
             .body(new LoginRequest(username, password))
             .retrieve()
             .body(LoginResponse.class);

		/*
		// Zu Testzwecken: Mock-Token zurückgeben
		// 1. Die Adressen-Liste erstellen
		List<LoginResponse.Address> addresses = List.of(
				new LoginResponse.Address("Musterstraße", "00000", "Musterstadt"),
				new LoginResponse.Address("Musterweg", "11111", "Musterort")
		);

		// 2. Die Rollen-Liste erstellen
		List<String> roles = List.of("ROLE_USER");

		// 3. Die Zahlungsinformationen erstellen
		LoginResponse.PaymentInformation paymentInfo =
				new LoginResponse.PaymentInformation("0001110001110001110001");

		// 4. Das User-Objekt zusammenbauen
		LoginResponse.User user = new LoginResponse.User(
				1L,
				"Thorsten Tester",
				"test@test.de",
				addresses,
				roles,
				paymentInfo
		);

		// 5. Das finale Haupt-Record-Objekt (AuthResponseRecord) erzeugen
		LoginResponse authResponse = new LoginResponse(
				user,
				"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzgxMjU3MTE0LCJleHAiOjE3ODEyNjQzMTR9.AP2cIwICA8EIFA1da7DNGyPDMrsUtetkifP_mETKfKs",
				"15c007f8-ad5e-4fbe-abd7-b06855b8ae4e"
		);
		*/

		System.out.println("MCP Server: Ergebnis Tool Methode login: " + authResponse.toString());
		return authResponse;
	}

	public record LoginRequest(String email, String password) {}
	//public record LoginResponse(String token) {}
	public record LoginResponse(
			User user,
			String accessToken,
			String refreshToken
	) {
		public record User(
				Long id,
				String name,
				String email,
				List<Address> addresses,
				List<String> roles,
				PaymentInformation paymentInformation
		) {}

		public record Address(
				String streetNr,
				String zip,
				String city
		) {}

		public record PaymentInformation(
				String iban
		) {}
	}

	@McpTool(description = "Führt den Checkout für einen Warenkorb aus. Erfordert zwingend einen gültigen Bearer Token aus dem Login.")
	public CheckoutResponse checkout(
			@McpToolParam(description = "Der gültige Bearer Token (ohne das Präfix 'Bearer ')") String bearerToken,
			@McpToolParam(description = "Die Liste der zu bestellenden Artikel") List<CheckoutRequest.CartItem> items,
			@McpToolParam(description = "Die Lieferadresse für die Bestellung") String shippingAddress) {

		CheckoutRequest body = new CheckoutRequest(items, shippingAddress);

		System.out.println("MCP Server: Aufruf Tool Methode checkout: Liste der zu bestellenden Artikel: " + items.toString() + " Lieferadresse: " + shippingAddress +  " Token: " +  bearerToken);

		/*
		// Zu Testzwecken: Mock-Bestätigung zurückgeben
		double mockTotal = items.stream().mapToDouble(item -> item.quantity() * 29.99).sum();
		CheckoutResponse checkoutResponse = new CheckoutResponse("order-" + java.util.UUID.randomUUID().toString().substring(0, 8), "SUCCESS", mockTotal);
		*/

		String rawJson = restClient.post()
				.uri("http://localhost:3000/checkout")
				.header("Authorization", "Bearer " + bearerToken)
				.body(body)
				.retrieve()
				.body(String.class);

		System.out.println("MCP Server: Rohe API-Antwort: " + rawJson);

		// 2. Prüfen, ob die Antwort leer war
		if (rawJson == null || rawJson.isBlank()) {
			System.out.println("MCP Server: Warnung! API hat einen leeren Body zurückgegeben.");
			return new CheckoutResponse("unknown", "SUCCESS_NO_BODY", 0.0);
		}

		// 3. Wenn Text da ist, in den Record umwandeln
		try {
			CheckoutResponse checkoutResponse = objectMapper.readValue(rawJson, CheckoutResponse.class);
			System.out.println("MCP Server: Ergebnis Tool Methode checkout erfolgreich gemappt.");
			return checkoutResponse; // Hier wird die Methode erfolgreich beendet
		} catch (Exception e) {
			System.err.println("MCP Server: Mapping-Fehler! Das JSON passte nicht zum Record: " + e.getMessage());
			throw new RuntimeException("API-Antwort konnte nicht verarbeitet werden: " + rawJson); // Hier bricht die Methode ab
		}

	}

	// --- Checkout ---
	public record CheckoutRequest(List<CartItem> items, String shippingAddress) {
		public record CartItem(String productId, int quantity) {}
	}
	public record CheckoutResponse(String orderId, String status, double totalAmount) {}

}