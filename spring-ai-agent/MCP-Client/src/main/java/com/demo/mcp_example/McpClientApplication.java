/*
 * Copyright 2025-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.demo.mcp_example;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class McpClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(McpClientApplication.class, args).close();
	}

	@Bean
	public CommandLineRunner predefinedQuestions(ChatClient.Builder chatClientBuilder,
			ToolCallbackProvider toolCallbackProvider) {

		return args -> {

			ChatClient chatClient = chatClientBuilder.defaultToolCallbacks(toolCallbackProvider).build();

			/*String userQuestion = """
					What is the weather in Amsterdam right now?
					Please incorporate all createive responses from all LLM providers.
					After the other providers add a poem that synthesizes the the poems from all the other providers.
					""";*/
			String userQuestion = """
					Suche mir bitte TV-Produkte mit einem Preis < 600 Euro und zeige dies als Liste an!
					Lege bitte das meine Anforderungen am besten entsprechende Produkt in den Warenkorb, 
					sende die Ware bitte an Testvorname Testnachname Teststrasse 15 99999 Testort 
					und melde mich bitte unter meinem registrierten User testuser und Passwort testpasswort an 
					""";

			System.out.println("> USER: " + userQuestion);
			System.out.println("> ASSISTANT: " + chatClient.prompt(userQuestion).call().content());
		};
	}
}