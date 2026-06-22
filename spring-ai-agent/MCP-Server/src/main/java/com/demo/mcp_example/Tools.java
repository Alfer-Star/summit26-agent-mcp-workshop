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



	// -------------------------------------------------------------------------
	// Private REST-Zugriffe
	// -------------------------------------------------------------------------

	private List<ProductRecord> fetchProducts(String lang, String productGroupId, String searchQuery) {
		String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/products/get")
				.queryParam("lang", lang)
				.queryParamIfPresent("productGroupId", java.util.Optional.ofNullable(productGroupId))
				.queryParamIfPresent("searchQuery", java.util.Optional.ofNullable(searchQuery))
				.toUriString();

		return restClient.get()
				.uri(uri)
				.retrieve()
				.body(new ParameterizedTypeReference<List<ProductRecord>>() {});
	}

	public record ProductRecord(
			String id,
			String imageUrl,
			String name,
			String description
	) {}


	private SingleProductResponse fetchProductDetails(String productId, String lang) {
		String uri = UriComponentsBuilder.fromUriString("http://localhost:3000/products/get-product")
				.queryParam("productId", productId)
				.queryParam("lang", lang)
				.toUriString();

		return restClient.get()
				.uri(uri)
				.header("accept", MediaType.APPLICATION_JSON_VALUE)
				.retrieve()
				.body(SingleProductResponse.class);
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

	private BasketItemResponse addItemToBasket(BasketItemRequest request) {
		return restClient.post()
				.uri("http://localhost:3000/basket/items")
				.body(request)
				.retrieve()
				.body(BasketItemResponse.class);
	}

	// --- Basket ---
	public record BasketItemRequest(long userId, String productId, int quantity) {}
	public record BasketItemResponse(String message) {}


}