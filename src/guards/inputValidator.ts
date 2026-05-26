/**
 * Input Validator Module
 * 
 * This module provides functions to validate user input before processing.
 * It ensures inputs meet basic requirements like non-empty strings and length limits.
 * This is the first line of defense in our safe chatbot.
 */

/**
 * Interface defining the structure of validation results
 * 
 * @property isValid - Boolean indicating if the input passed validation
 * @property error - Optional error message explaining why validation failed
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Configuration interface for input validation rules
 * 
 * @property maxLength - Maximum allowed length for user input (default: 500 characters)
 */
export interface ValidationConfig {
  maxLength: number;
}

/**
 * Validates user input against multiple criteria
 * 
 * This function performs the following checks:
 * 1. Ensures input is not null or undefined
 * 2. Ensures input is not an empty string (after trimming whitespace)
 * 3. Ensures input does not exceed maximum length limit
 * 
 * @param input - The user's input string to validate
 * @param config - Configuration object with validation rules
 * @returns ValidationResult object with isValid flag and optional error message
 * 
 * @example
 * ```typescript
 * const result = validateInput("Hello chatbot", { maxLength: 500 });
 * if (result.isValid) {
 *   // Process the input
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateInput(
  input: string,
  config: ValidationConfig
): ValidationResult {
  // Check if input is null or undefined
  if (input === null || input === undefined) {
    return {
      isValid: false,
      error: 'Input cannot be null or undefined',
    };
  }

  // Trim whitespace and check if the input is empty
  const trimmedInput = input.trim();
  if (trimmedInput.length === 0) {
    return {
      isValid: false,
      error: 'Input cannot be empty',
    };
  }

  // Check if input exceeds maximum allowed length
  if (trimmedInput.length > config.maxLength) {
    return {
      isValid: false,
      error: `Input exceeds maximum length of ${config.maxLength} characters`,
    };
  }

  // All validations passed
  return {
    isValid: true,
  };
}

/**
 * Default validation configuration
 * 
 * These values are used when no custom configuration is provided.
 * - maxLength: 500 characters (reasonable for chat messages)
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  maxLength: 500,
};
