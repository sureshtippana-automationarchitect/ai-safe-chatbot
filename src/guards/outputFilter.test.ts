/**
 * Unit Tests for Output Filter
 * 
 * These tests verify that the output filtering logic correctly sanitizes
 * AI-generated responses by removing unsafe words.
 */

import {
  filterUnsafeWords,
  addUnsafeWords,
  getUnsafeWords,
} from './outputFilter';

describe('Output Filter', () => {
  describe('filterUnsafeWords', () => {
    // Test case: Clean output should pass through unchanged
    it('should return unchanged text for clean output', () => {
      const input = 'This is a clean and safe response.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe(input);
      expect(result.wasFiltered).toBe(false);
      expect(result.replacedWords).toHaveLength(0);
    });

    // Test case: Profanity should be filtered
    it('should filter profanity from output', () => {
      const input = 'This is a damn good example.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('This is a *** good example.');
      expect(result.wasFiltered).toBe(true);
      expect(result.replacedWords).toContain('damn');
    });

    // Test case: Multiple occurrences of same word should all be filtered
    it('should filter all occurrences of unsafe words', () => {
      const input = 'Damn, this is damn difficult.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('***, this is *** difficult.');
      expect(result.wasFiltered).toBe(true);
      expect(result.replacedWords).toContain('damn');
      // Should only list each word once in replacedWords
      expect(result.replacedWords.filter((w: string) => w === 'damn')).toHaveLength(1);
    });

    // Test case: Multiple different unsafe words should all be filtered
    it('should filter multiple different unsafe words', () => {
      const input = 'This is damn stupid.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('This is *** ***.');
      expect(result.wasFiltered).toBe(true);
      expect(result.replacedWords).toHaveLength(2);
      expect(result.replacedWords).toContain('damn');
      expect(result.replacedWords).toContain('stupid');
    });

    // Test case: Case-insensitive filtering should work
    it('should filter words case-insensitively', () => {
      const testCases = [
        'This is DAMN good.',
        'This is Damn good.',
        'This is damn good.',
        'This is DaMn good.',
      ];
      
      testCases.forEach(testCase => {
        const result = filterUnsafeWords(testCase);
        expect(result.filteredText).toBe('This is *** good.');
        expect(result.wasFiltered).toBe(true);
      });
    });

    // Test case: Word boundaries should prevent partial matches
    it('should not filter partial word matches', () => {
      // "assistance" contains "ass" but should not be filtered
      const input = 'I need your assistance with this task.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe(input);
      expect(result.wasFiltered).toBe(false);
    });

    // Test case: Empty string should pass through
    it('should handle empty string', () => {
      const result = filterUnsafeWords('');
      
      expect(result.filteredText).toBe('');
      expect(result.wasFiltered).toBe(false);
      expect(result.replacedWords).toHaveLength(0);
    });

    // Test case: String with only unsafe words
    it('should handle string with only unsafe words', () => {
      const input = 'damn stupid';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('*** ***');
      expect(result.wasFiltered).toBe(true);
      expect(result.replacedWords).toHaveLength(2);
    });

    // Test case: Unsafe words at the beginning of string
    it('should filter unsafe words at the beginning', () => {
      const input = 'Damn, I forgot!';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('***, I forgot!');
      expect(result.wasFiltered).toBe(true);
    });

    // Test case: Unsafe words at the end of string
    it('should filter unsafe words at the end', () => {
      const input = 'This is damn';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('This is ***');
      expect(result.wasFiltered).toBe(true);
    });

    // Test case: Unsafe words with punctuation
    it('should filter unsafe words with punctuation', () => {
      const input = 'This is damn! Really, damn.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('This is ***! Really, ***.');
      expect(result.wasFiltered).toBe(true);
    });

    // Test case: Multi-line text should be handled
    it('should handle multi-line text', () => {
      const input = 'Line 1 is damn good.\nLine 2 is also damn good.';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('Line 1 is *** good.\nLine 2 is also *** good.');
      expect(result.wasFiltered).toBe(true);
    });

    // Test case: Special characters and emojis should not interfere
    it('should handle special characters and emojis', () => {
      const input = 'This is damn good! 😊';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('This is *** good! 😊');
      expect(result.wasFiltered).toBe(true);
    });
  });

  describe('addUnsafeWords', () => {
    // Test case: Should be able to add custom unsafe words
    it('should add custom unsafe words', () => {
      const beforeCount = getUnsafeWords().length;
      addUnsafeWords(['customUnsafeWord']);
      const afterCount = getUnsafeWords().length;
      
      expect(afterCount).toBe(beforeCount + 1);
      expect(getUnsafeWords()).toContain('customUnsafeWord');
    });

    // Test case: Should filter newly added words
    it('should filter newly added unsafe words', () => {
      addUnsafeWords(['testUnsafe']);
      const result = filterUnsafeWords('This is testUnsafe content');
      
      expect(result.filteredText).toBe('This is *** content');
      expect(result.wasFiltered).toBe(true);
      expect(result.replacedWords).toContain('testUnsafe');
    });

    // Test case: Should add multiple words at once
    it('should add multiple words at once', () => {
      const beforeCount = getUnsafeWords().length;
      addUnsafeWords(['unsafe1', 'unsafe2', 'unsafe3']);
      const afterCount = getUnsafeWords().length;
      
      expect(afterCount).toBe(beforeCount + 3);
    });
  });

  describe('getUnsafeWords', () => {
    // Test case: Should return an array
    it('should return an array of unsafe words', () => {
      const words = getUnsafeWords();
      
      expect(Array.isArray(words)).toBe(true);
      expect(words.length).toBeGreaterThan(0);
    });

    // Test case: Should include default unsafe words
    it('should include default unsafe words', () => {
      const words = getUnsafeWords();
      
      expect(words).toContain('damn');
      expect(words).toContain('stupid');
    });

    // Test case: Should return a copy to prevent external modification
    it('should return a copy to prevent external modification', () => {
      const words1 = getUnsafeWords();
      const words2 = getUnsafeWords();
      
      // Modifying one should not affect the other
      words1.push('shouldNotAffectOriginal');
      
      expect(words2).not.toContain('shouldNotAffectOriginal');
    });
  });

  describe('Edge cases', () => {
    // Test case: Very long text should be handled
    it('should handle very long text', () => {
      const longText = 'This is a very long text. '.repeat(100) + 'damn';
      const result = filterUnsafeWords(longText);
      
      expect(result.wasFiltered).toBe(true);
      expect(result.filteredText).toContain('***');
    });

    // Test case: Text with only whitespace and unsafe word
    it('should handle whitespace around unsafe words', () => {
      const input = '   damn   ';
      const result = filterUnsafeWords(input);
      
      expect(result.filteredText).toBe('   ***   ');
      expect(result.wasFiltered).toBe(true);
    });
  });
});
