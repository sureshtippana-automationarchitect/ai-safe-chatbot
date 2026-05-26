/**
 * Output Filter Module
 * 
 * This module sanitizes AI model responses by filtering out unsafe words.
 * It acts as the final safety layer before presenting responses to users.
 * Even if harmful content slips through input validation, this prevents
 * it from being displayed to the user.
 */

/**
 * Interface defining the structure of filter results
 * 
 * @property filteredText - The sanitized output with unsafe words replaced
 * @property wasFiltered - Boolean indicating if any filtering occurred
 * @property replacedWords - Array of words that were filtered out
 */
export interface OutputFilterResult {
  filteredText: string;
  wasFiltered: boolean;
  replacedWords: string[];
}

/**
 * List of unsafe words to filter from model responses
 * 
 * This list includes:
 * - Profanity and offensive language
 * - Discriminatory terms
 * - Violent language
 * 
 * Note: This is a basic example. In production, consider using:
 * - A comprehensive bad words list
 * - A professional content filtering service
 * - Context-aware filtering (some words may be acceptable in certain contexts)
 */
const UNSAFE_WORDS: string[] = [
  // Profanity (examples - expand based on your requirements)
  'damn',
  'hell',
  'crap',
  
  // Offensive terms
  'stupid',
  'idiot',
  'dumb',
  
  // Add more words as needed
  // In production, use a comprehensive list or external service
];

/**
 * Replacement string for filtered words
 * 
 * When unsafe words are detected, they are replaced with this string.
 * You could also use:
 * - '***' for complete censoring
 * - '[filtered]' for clarity
 * - Empty string to remove the word entirely
 */
const REPLACEMENT = '***';

/**
 * Filters unsafe words from model output
 * 
 * This function sanitizes AI-generated responses by:
 * 1. Identifying unsafe words in the text
 * 2. Replacing them with the replacement string
 * 3. Tracking which words were filtered
 * 4. Returning the clean text with metadata
 * 
 * The function uses case-insensitive matching with word boundaries
 * to avoid false positives (e.g., "assist" won't match "ass").
 * 
 * @param output - The AI model's output text to filter
 * @returns OutputFilterResult with sanitized text and filter details
 * 
 * @example
 * ```typescript
 * const result = filterUnsafeWords("This is a damn good example");
 * console.log(result.filteredText); // "This is a *** good example"
 * console.log(result.wasFiltered);  // true
 * console.log(result.replacedWords); // ["damn"]
 * ```
 */
export function filterUnsafeWords(output: string): OutputFilterResult {
  let filteredText = output;
  const replacedWords: string[] = [];

  // Iterate through each unsafe word and replace it if found
  for (const word of UNSAFE_WORDS) {
    // Create a regex pattern for case-insensitive matching with word boundaries
    // The 'gi' flags mean: global (all occurrences) and case-insensitive
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    
    // Check if the word exists in the text
    if (regex.test(filteredText)) {
      // Add to list of replaced words (avoid duplicates)
      if (!replacedWords.includes(word)) {
        replacedWords.push(word);
      }
      
      // Replace all occurrences of the unsafe word
      filteredText = filteredText.replace(regex, REPLACEMENT);
    }
  }

  // Return the result with metadata about the filtering
  return {
    filteredText,
    wasFiltered: replacedWords.length > 0,
    replacedWords,
  };
}

/**
 * Adds custom words to the unsafe words list
 * 
 * This allows runtime extension of the filter with domain-specific
 * or context-specific words to block.
 * 
 * @param words - Array of additional words to filter
 * 
 * @example
 * ```typescript
 * addUnsafeWords(['proprietary', 'confidential']);
 * ```
 */
export function addUnsafeWords(words: string[]): void {
  UNSAFE_WORDS.push(...words);
}

/**
 * Gets the current list of unsafe words
 * 
 * Useful for debugging or administrative purposes.
 * Returns a copy to prevent external modification.
 * 
 * @returns Array of unsafe words currently being filtered
 */
export function getUnsafeWords(): string[] {
  return [...UNSAFE_WORDS];
}

/**
 * Sets a custom replacement string for filtered words
 * 
 * This is currently not exported but could be made configurable
 * by accepting the replacement as a parameter to filterUnsafeWords().
 * 
 * @param replacement - The string to use when replacing unsafe words
 */
// export function setReplacement(replacement: string): void {
//   REPLACEMENT = replacement;
// }
