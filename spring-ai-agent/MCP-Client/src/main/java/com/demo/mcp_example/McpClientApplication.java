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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class McpClientApplication {

	// 1. Credentials aus den application.properties injizieren
	@Value("${shopping.api.username:test@test.de}")
	private String apiUsername;

	@Value("${shopping.api.password:password1}")
	private String apiPassword;

	public static void main(String[] args) {
		SpringApplication.run(McpClientApplication.class, args).close();
	}

	@Bean
	public CommandLineRunner predefinedQuestions(ChatClient.Builder chatClientBuilder,
			ToolCallbackProvider toolCallbackProvider) {

		return args -> {

			ChatClient chatClient = chatClientBuilder.defaultToolCallbacks(toolCallbackProvider).build();

			String systemPrompt = """
                Du bist ein autonomer Einkaufs-Agent für ein Online-Portal.
                Der Benutzer beauftragt dich, passende Produkte zu suchen und den Kauf vollständig abzuschließen.
                
                WICHTIG FÜR DIE AUTHENTIFIZIERUNG:
                Nutze für alle geschützten Aktionen (wie den Checkout) die folgenden hinterlegten Benutzerdaten:
                - Benutzername/E-Mail: %s
                - Passwort: %s
                
                Rufe zuerst das Login-Tool mit diesen Daten auf, um den Bearer Token zu erhalten, bevor du den Checkout ausführst.
                """.formatted(apiUsername, apiPassword);

			String userQuestion = """
					Suche mir bitte ein bequemes Kleidungsstück zu einem Preis < 100 Euro und zeige die Liste passender Produkte an!
					Was ist das für meine Anforderungen am besten entsprechende Produkt?
					Kaufe das bitte und 
					sende die Ware bitte an Testvorname Testnachname Teststrasse 15 99999 Testort 
					und melde mich bitte unter meinem registrierten User test@test.de und Passwort password1 an 
					""";

			System.out.println("> SYSTEM PROMPT INJECTED (Credentials hidden in console)");
			System.out.println("> USER: " + userQuestion);

			//Aufruf des ChatClients mit getrenntem System- und User-Prompt
			String assistantResponse = chatClient.prompt()
					.system(systemPrompt) // Hier wird die Rolle & Credentials übergeben
					.user(userQuestion)   // Hier wird die eigentliche Aufgabe übergeben
					.call()
					.content();

			System.out.println("> ASSISTANT: " + assistantResponse);
		};
	}
}