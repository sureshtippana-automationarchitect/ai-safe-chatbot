/**
 * OpenAI Service Module
 * 
 * This module handles all interactions with the OpenAI API.
 * It provides a clean interface for sending chat messages and receiving responses.
 * All OpenAI-specific logic is encapsulated here for easy maintenance and testing.
 */

import OpenAI from 'openai';

/**
 * Interface for chat message structure
 * 
 * This follows OpenAI's chat completion message format.
 * 
 * @property role - The role of the message sender (system, user, or assistant)
 * @property content - The actual message text
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Interface for OpenAI service configuration
 * 
 * @property apiKey - Your OpenAI API key (from environment variables)
 * @property model - The OpenAI model to use (e.g., 'gpt-3.5-turbo', 'gpt-4')
 * @property temperature - Controls randomness (0.0 = focused, 2.0 = creative)
 */
export interface OpenAIConfig {
  apiKey: string;
  model: string;
  temperature?: number;
}

/**
 * OpenAI Service Class
 * 
 * This class manages the connection to OpenAI and provides methods
 * for generating chat responses. It handles:
 * - API client initialization
 * - Message formatting
 * - Error handling
 * - Response extraction
 */
export class OpenAIService {
  private client: OpenAI;
  private model: string;
  private temperature: number;

  /**
   * Creates a new OpenAI service instance
   * 
   * @param config - Configuration object with API key and model settings
   * 
   * @example
   * ```typescript
   * const service = new OpenAIService({
   *   apiKey: process.env.OPENAI_API_KEY!,
   *   model: 'gpt-3.5-turbo',
   *   temperature: 0.7
   * });
   * ```
   */
  constructor(config: OpenAIConfig) {
    // Initialize the OpenAI client with the provided API key
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });

    // Store model and temperature settings
    this.model = config.model;
    this.temperature = config.temperature ?? 0.7; // Default to 0.7 if not provided
  }

  /**
   * Sends a chat message to OpenAI and gets a response
   * 
   * This method:
   * 1. Formats the user's message with a system prompt
   * 2. Sends the request to OpenAI's Chat Completions API
   * 3. Extracts and returns the response text
   * 4. Handles errors gracefully
   * 
   * The system message sets the behavior and personality of the chatbot.
   * You can customize it to create different types of assistants.
   * 
   * @param userMessage - The user's message to send to the AI
   * @returns Promise resolving to the AI's response text
   * @throws Error if the API call fails or returns an invalid response
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await service.getChatResponse("What is TypeScript?");
   *   console.log(response);
   * } catch (error) {
   *   console.error("Failed to get response:", error);
   * }
   * ```
   */
  async getChatResponse(userMessage: string): Promise<string> {
    try {
      // Create the messages array for the chat completion
      // The system message defines the assistant's behavior
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: 'You are a helpful, friendly, and safe assistant. ' +
                   'Provide accurate and concise answers. ' +
                   'If asked about harmful topics, politely decline and suggest positive alternatives.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ];

      // Call the OpenAI Chat Completions API
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: 500, // Limit response length to control costs
      });

      // Extract the response text from the completion
      const responseMessage = completion.choices[0]?.message?.content;

      // Validate that we received a response
      if (!responseMessage) {
        throw new Error('No response received from OpenAI');
      }

      return responseMessage;
    } catch (error) {
      // Handle and re-throw errors with additional context
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while calling OpenAI API');
    }
  }

  /**
   * Gets the current model being used
   * 
   * Useful for logging and debugging purposes.
   * 
   * @returns The name of the OpenAI model (e.g., 'gpt-3.5-turbo')
   */
  getModel(): string {
    return this.model;
  }

  /**
   * Gets the current temperature setting
   * 
   * @returns The temperature value (0.0 to 2.0)
   */
  getTemperature(): number {
    return this.temperature;
  }
}
