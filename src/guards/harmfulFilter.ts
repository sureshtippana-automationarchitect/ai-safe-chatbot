/**
 * Harmful Content Filter Module
 * 
 * This module detects and blocks potentially harmful or inappropriate user queries.
 * It uses keyword-based detection to identify content that should not be processed.
 * This prevents the chatbot from engaging with malicious or inappropriate requests.
 */

/**
 * Interface defining the structure of filter results
 * 
 * @property isHarmful - Boolean indicating if harmful content was detected
 * @property reason - Optional explanation of why content was flagged as harmful
 * @property detectedKeywords - Array of harmful keywords found in the input
 */
export interface HarmfulFilterResult {
  isHarmful: boolean;
  reason?: string;
  detectedKeywords?: string[];
}

/**
 * List of harmful keywords and phrases to detect
 * 
 * This list includes categories of harmful content:
 * - Violence and threats
 * - Illegal activities
 * - Hate speech
 * - Self-harm
 * - Explicit content
 * 
 * Note: In a production system, you would use a more sophisticated
 * content moderation API (like OpenAI's Moderation API) instead of
 * simple keyword matching.
 */
const HARMFUL_KEYWORDS: string[] = [
  // Violence-related
  'kill',
  'murder',
  'attack',
  'bomb',
  'weapon',
  'violence',
  
  // Illegal activities
  'hack',
  'steal',
  'illegal',
  'drugs',
  'fraud',
  
  // Hate speech
  'hate',
  'racist',
  'discrimination',
  
  // Self-harm
  'suicide',
  'self-harm',
  'hurt myself',
  
  // Explicit content
  'explicit',
  'nsfw',
];

/**
 * Checks if user input contains harmful content
 * 
 * This function performs case-insensitive keyword matching to detect
 * potentially harmful content in user queries. It searches for known
 * harmful keywords and phrases.
 * 
 * Algorithm:
 * 1. Convert input to lowercase for case-insensitive matching
 * 2. Check each harmful keyword against the input
 * 3. Use word boundaries to avoid false positives (e.g., "class" won't match "lass")
 * 4. Collect all detected keywords
 * 5. Return result with harmful flag and details
 * 
 * @param input - The user's input string to check
 * @returns HarmfulFilterResult with detection status and details
 * 
 * @example
 * ```typescript
 * const result = checkForHarmfulContent("How do I bake a cake?");
 * if (!result.isHarmful) {
 *   // Safe to process
 * }
 * ```
 */
export function checkForHarmfulContent(input: string): HarmfulFilterResult {
  // Convert input to lowercase for case-insensitive comparison
  const lowerInput = input.toLowerCase();
  
  // Array to store detected harmful keywords
  const detectedKeywords: string[] = [];

  // Check each harmful keyword against the input
  for (const keyword of HARMFUL_KEYWORDS) {
    // Use word boundary regex to match whole words only
    // This prevents false positives like "class" matching "lass"
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    
    if (regex.test(lowerInput)) {
      detectedKeywords.push(keyword);
    }
  }

  // If any harmful keywords were detected, return harmful result
  if (detectedKeywords.length > 0) {
    return {
      isHarmful: true,
      reason: 'Input contains potentially harmful content',
      detectedKeywords,
    };
  }

  // No harmful content detected
  return {
    isHarmful: false,
  };
}

/**
 * Adds custom keywords to the harmful keywords list
 * 
 * This function allows you to extend the filter with domain-specific
 * or context-specific harmful keywords at runtime.
 * 
 * @param keywords - Array of additional keywords to block
 * 
 * @example
 * ```typescript
 * addHarmfulKeywords(['spam', 'phishing']);
 * ```
 */
export function addHarmfulKeywords(keywords: string[]): void {
  HARMFUL_KEYWORDS.push(...keywords);
}

/**
 * Gets the current list of harmful keywords
 * 
 * Useful for debugging or displaying the filter rules to administrators.
 * Returns a copy to prevent external modification.
 * 
 * @returns Array of harmful keywords currently in use
 */
export function getHarmfulKeywords(): string[] {
  return [...HARMFUL_KEYWORDS];
}
