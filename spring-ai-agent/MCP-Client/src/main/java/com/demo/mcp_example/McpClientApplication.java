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
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.tool.ToolCallbackProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Scanner;

@SpringBootApplication
public class McpClientApplication {

	@Value("${shopping.api.username:test@test.de}")
	private String apiUsername;

	@Value("${shopping.api.password:password1}")
	private String apiPassword;

	public static void main(String[] args) {
		SpringApplication.run(McpClientApplication.class, args).close();
	}

	@Bean
	public CommandLineRunner interactiveChat(ChatClient.Builder chatClientBuilder,
			ToolCallbackProvider toolCallbackProvider) {

		return args -> {
			/**
			var memory = new InMemoryChatMemory();

			ChatClient chatClient = chatClientBuilder
					.defaultToolCallbacks(toolCallbackProvider)
					.defaultAdvisors(new MessageChatMemoryAdvisor(memory))
					.build();
			 **/

			// CHAT MEMORY
			var chatMemory = MessageWindowChatMemory.builder().maxMessages(10).build();

			ChatClient chatClient = chatClientBuilder
					.defaultToolCallbacks(toolCallbackProvider)
					.defaultAdvisors(MyLoggingAdvisor.builder()
							.showConversationHistory(true)
							.build())
					.defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
					.build();



			String systemPrompt = """
                Du bist ein autonomer Einkaufs-Agent für ein Online-Portal.
                Der Benutzer beauftragt dich, passende Produkte zu suchen und den Kauf vollständig abzuschließen.

                WICHTIG FÜR DIE AUTHENTIFIZIERUNG:
                Nutze für alle geschützten Aktionen (wie den Checkout) die folgenden hinterlegten Benutzerdaten:
                - Benutzername/E-Mail: %s
                - Passwort: %s

                Rufe zuerst das Login-Tool mit diesen Daten auf, um den Bearer Token zu erhalten, bevor du den Checkout ausführst.

                Falls du für eine Aufgabe wichtige Informationen benötigst (z.B. Lieferadresse, Größe, Farbe),
                stelle gezielte Rückfragen an den Benutzer, bevor du fortfährst.
                """.formatted(apiUsername, apiPassword);

			Scanner scanner = new Scanner(System.in);

			System.out.println("╔══════════════════════════════════════════╗");
			System.out.println("║         Einkaufs-Agent gestartet         ║");
			System.out.println("║  'exit' oder 'quit' zum Beenden eingeben ║");
			System.out.println("╚══════════════════════════════════════════╝");
			System.out.println();

			while (true) {
				System.out.print("Sie: ");
				System.out.flush();

				String userInput = scanner.nextLine().trim();

				if (userInput.equalsIgnoreCase("exit") || userInput.equalsIgnoreCase("quit")) {
					System.out.println("Auf Wiedersehen!");
					break;
				}

				if (userInput.isEmpty()) {
					continue;
				}

				String response = chatClient.prompt()
						.system(systemPrompt)
						.user(userInput)
						.call()
						.content();

				System.out.println();
				System.out.println("Agent: " + response);
				System.out.println();
			}
		};
	}
}