/**
 * Safe Chatbot Application
 * 
 * This is the main entry point for the safe chatbot application.
 * It orchestrates all the components:
 * - Input validation
 * - Harmful content filtering
 * - OpenAI API integration
 * - Output filtering
 * 
 * The application provides a command-line interface for chatting with the AI
 * while ensuring safety at every step of the process.
 */

import * as dotenv from 'dotenv';
import * as readline from 'readline';
import { validateInput } from './guards/inputValidator';
import { checkForHarmfulContent } from './guards/harmfulFilter';
import { filterUnsafeWords } from './guards/outputFilter';
import { OpenAIService } from './services/openaiService';

// Load environment variables from .env file
dotenv.config();

/**
 * Main Chatbot Class
 * 
 * This class brings together all the safety guards and the OpenAI service
 * to create a complete safe chatbot experience.
 */
class SafeChatbot {
  private openaiService: OpenAIService;
  private rl: readline.Interface;

  /**
   * Initialize the chatbot with all required services
   * 
   * This constructor:
   * 1. Validates that required environment variables are present
   * 2. Creates an OpenAI service instance
   * 3. Sets up the readline interface for user input
   */
  constructor() {
    // Validate that OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is not set. ' +
        'Please copy .env.example to .env and add your API key.'
      );
    }

    // Initialize the OpenAI service with configuration from environment
    this.openaiService = new OpenAIService({
      apiKey: apiKey,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    });

    // Create readline interface for command-line interaction
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('🤖 Safe Chatbot initialized successfully!');
    console.log(`📝 Model: ${this.openaiService.getModel()}`);
    console.log(`🌡️  Temperature: ${this.openaiService.getTemperature()}`);
    console.log('');
  }

  /**
   * Process a single user message through the safety pipeline
   * 
   * This method implements the complete safety flow:
   * 1. Validate input (empty check, length limit)
   * 2. Check for harmful content (keyword detection)
   * 3. Get AI response (OpenAI API call)
   * 4. Filter unsafe words from response
   * 5. Return the safe response
   * 
   * @param userInput - The user's message
   * @returns Promise resolving to the safe AI response
   */
  async processMessage(userInput: string): Promise<string> {
    // STEP 1: Validate input
    const maxLength = parseInt(process.env.MAX_INPUT_LENGTH || '500');
    const validationResult = validateInput(userInput, { maxLength });
    
    if (!validationResult.isValid) {
      return `❌ Validation Error: ${validationResult.error}`;
    }

    // STEP 2: Check for harmful content
    const harmfulCheck = checkForHarmfulContent(userInput);
    
    if (harmfulCheck.isHarmful) {
      return `🚫 I cannot process this request as it contains potentially harmful content. ` +
             `Please rephrase your question in a respectful and constructive way.`;
    }

    try {
      // STEP 3: Get AI response
      console.log('🤔 Thinking...');
      const aiResponse = await this.openaiService.getChatResponse(userInput);

      // STEP 4: Filter unsafe words from the response
      const filterResult = filterUnsafeWords(aiResponse);

      // Log if filtering occurred (for monitoring purposes)
      if (filterResult.wasFiltered) {
        console.log(`⚠️  Filtered ${filterResult.replacedWords.length} unsafe word(s) from response`);
      }

      // STEP 5: Return the safe response
      return filterResult.filteredText;
    } catch (error) {
      // Handle any errors that occur during AI processing
      if (error instanceof Error) {
        return `❌ Error: ${error.message}`;
      }
      return '❌ An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Start the interactive chat loop
   * 
   * This method creates an interactive command-line chat interface.
   * Users can type messages and receive responses until they type 'exit' or 'quit'.
   */
  async start(): Promise<void> {
    console.log('💬 Welcome to Safe Chatbot!');
    console.log('ℹ️  Type your message and press Enter to chat.');
    console.log('ℹ️  Type "exit" or "quit" to stop the chatbot.');
    console.log('─'.repeat(50));
    console.log('');

    // Recursive function to handle the chat loop
    const promptUser = (): void => {
      this.rl.question('You: ', async (input) => {
        // Trim whitespace from input
        const trimmedInput = input.trim();

        // Check for exit commands
        if (trimmedInput.toLowerCase() === 'exit' || trimmedInput.toLowerCase() === 'quit') {
          console.log('');
          console.log('👋 Goodbye! Thanks for using Safe Chatbot.');
          this.rl.close();
          return;
        }

        // Skip empty inputs
        if (trimmedInput.length === 0) {
          promptUser();
          return;
        }

        // Process the user's message
        const response = await this.processMessage(trimmedInput);
        
        // Display the response
        console.log('');
        console.log(`Bot: ${response}`);
        console.log('');

        // Continue the chat loop
        promptUser();
      });
    };

    // Start the chat loop
    promptUser();
  }
}

/**
 * Application Entry Point
 * 
 * This is where the program starts execution.
 * It creates a chatbot instance and starts the interactive chat.
 */
async function main() {
  try {
    // Create and start the chatbot
    const chatbot = new SafeChatbot();
    await chatbot.start();
  } catch (error) {
    // Handle initialization errors
    if (error instanceof Error) {
      console.error('Failed to start chatbot:', error.message);
    } else {
      console.error('An unexpected error occurred during initialization');
    }
    process.exit(1);
  }
}

// Run the application if this file is executed directly
if (require.main === module) {
  main();
}

// Export for testing purposes
export { SafeChatbot };
