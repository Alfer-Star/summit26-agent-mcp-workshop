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


		List<ProductGroupRecord> listProductGroups = restClient.get()
				.uri("http://localhost:3000/product-groups/get?lang={lang}", lang)
				.retrieve()
				.body(new ParameterizedTypeReference<List<ProductGroupRecord>>() {});

		return listProductGroups;

		//Falls zu Testzwecken benötigt:
		/*return List.of(
				new ProductGroupRecord(
						new ProductGroupRecord.ProductGroup("1", "https://example.com/img1.png", "Elektronik")
				),
				new ProductGroupRecord(
						new ProductGroupRecord.ProductGroup("2", "https://example.com/img2.png", "Kleidung")
				)
		);*/

	}

	public record ProductGroupRecord(ProductGroup productGroup) {
		public record ProductGroup(String id, String imageUrl, String name) {
		}
	}

	//Returns all products, optionally filtered by product group and/or a search query. The lang parameter controls which language variant of name, description, and detailedDescription is returned.
	//
	//productGroupId and searchQuery can be combined.
	//The search is a case-sensitive substring match on both name and description.
	@McpTool(description = "Gib alle Produkte zurück, optional gefiltert nach Produktgruppe und/oder einem Suchbegriff. " +
			"Der Parameter „lang“ steuert, welche Sprachvariante von Name, Beschreibung und Detailbeschreibung zurückgegeben wird.")
	public List<ProductRecord> getProducts(
			@McpToolParam(description = "Die Sprachvariante von Name, Beschreibung und Detailbeschreibung") String lang,
			@McpToolParam(description = "Filtert Ergebnisse auf eine Produktgruppe") String productGroupId,
			@McpToolParam(description = "Suchbegriff für Suche auf Produktname und Produktbeschreibung") String searchQuery) {

		// Dynamischer Aufbau der URI inklusive der optionalen Query-Parameter
		String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/products/get")
				.queryParam("lang", lang)
				.queryParamIfPresent("productGroupId", java.util.Optional.ofNullable(productGroupId))
				.queryParamIfPresent("searchQuery", java.util.Optional.ofNullable(searchQuery))
				.toUriString();

		// REST-Aufruf mit dem korrekten Ziel-Typ (ProductRecord)
		List<ProductRecord> listProducts = restClient.get()
				.uri(uri)
				.retrieve()
				.body(new ParameterizedTypeReference<List<ProductRecord>>() {});

		return listProducts;

		// Falls zu Testzwecken benötigt (angepasst an die OpenAPI-Spezifikation):
        /*
        return List.of(
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

	}

	/*
	* # -- Products ------------------------------------------------------------
    Product:
      type: object
      properties:
        id:
          type: string
          example: "prod-001"
        imageUrl:
          type: string
          format: uri
          example: "https://example.com/images/prod-001.jpg"
        rating:
          type: number
          format: float
          minimum: 0
          maximum: 5
          example: 4.3
        price:
          type: number
          format: float
          example: 29.99
        availableQuantity:
          type: integer
          example: 150
        deliveryDuration:
          type: integer
          description: Estimated delivery time in days.
          example: 3
        name:
          type: string
          description: Localised name (language selected via `lang` query param).
          example: "Wooden Chair"
        description:
          type: string
          description: Localised short description.
          example: "Comfortable and durable wooden chair."
        detailedDescription:
          type: string
          description: Localised detailed description.
          example: "Hand-crafted from solid oak wood..."

*/
	public record ProductRecord(Product product) {
		public record Product(String id, String imageUrl, float rating, float price, int availableQuantity,
		int deliveryDuration, String name, String description, String detailedDescription) {
		}
	}

/*
# -- Product Groups ------------------------------------------------------
    ProductGroup:
      type: object
      properties:
        id:
          type: string
          example: "grp-001"
        imageUrl:
          type: string
          format: uri
          example: "https://example.com/images/grp-001.jpg"
        name:
          type: string
          description: Localised name (language selected via `lang` query param).
          example: "Furniture"
* */

	@McpTool(description = "Greeting response")
	public String hello(String myName) {
		return "Hello " + myName + "!";
	}

	@McpTool(description = "Get the temperature (in celsius) for a specific location")
	public String poeticWeatherForecast(McpSyncRequestContext context,
			@McpToolParam(description = "The location latitude") double latitude,
			@McpToolParam(description = "The location longitude") double longitude) {

		WeatherResponse weather = restClient.get()
			.uri("https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m",
					latitude, longitude)
			.retrieve()
			.body(WeatherResponse.class);

		//var weatherJson = ModelOptionsUtils.toJsonStringPrettyPrinter(weather);
		String weatherJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(weather);

		context.info("Raw weather response: " + weatherJson);

		String weatherPoem = "none";

		if (context.sampleEnabled()) {

			context.info("Start sampling");

			var sampleResponse = context.sample(spec -> spec.systemPrompt("You are a poet!")
				.message(
						"Please write a poem about this weather forecast (temperature is in Celsius). Use markdown format :\n "
								+ weatherJson));

			weatherPoem = ((TextContent) sampleResponse.content()).text();

			context.info("Finish Sampling");
		}

		context.info("Weather poem is done!");

		return "Poem about the weather: " + weatherPoem + "\n" + weatherJson;

	}

	public record WeatherResponse(Current current) {
		public record Current(LocalDateTime time, int interval, double temperature_2m) {
		}
	}

}