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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Scanner;

/**
		* @author Jochen Kirchner
 */

@SpringBootApplication
public class McpClientApplication {

	@Value("${shopping.api.userid:1}")
	private String apiUserId;

	public static void main(String[] args) {
		SpringApplication.run(McpClientApplication.class, args).close();
	}

	@Bean
	public CommandLineRunner interactiveChat(ChatClient.Builder chatClientBuilder,
			ToolCallbackProvider toolCallbackProvider) {

		return args -> {

			ChatClient chatClient = chatClientBuilder
					.defaultAdvisors(MyLoggingAdvisor.builder()
							.showConversationHistory(true)
							.build())
					.build();


			String systemPrompt = """
                Du bist ein persönlicher Assistent.
                Stelle die Frage nach Vornamen, spreche den Benutzer mit seinem Vornamen an und stelle die Frage nach Wünschen des Nutzers.
                """;

			Scanner scanner = new Scanner(System.in);

			System.out.println("╔══════════════════════════════════════════╗");
			System.out.println("║         Persönlicher-Agent gestartet     ║");
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