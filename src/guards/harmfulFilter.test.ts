/**
 * Unit Tests for Harmful Content Filter
 * 
 * These tests verify that the harmful content detection logic works correctly
 * and can identify various types of harmful content.
 */

import {
  checkForHarmfulContent,
  addHarmfulKeywords,
  getHarmfulKeywords,
} from './harmfulFilter';

describe('Harmful Content Filter', () => {
  describe('checkForHarmfulContent', () => {
    // Test case: Safe content should pass
    it('should return not harmful for safe content', () => {
      const result = checkForHarmfulContent('What is the weather like today?');
      
      expect(result.isHarmful).toBe(false);
      expect(result.reason).toBeUndefined();
      expect(result.detectedKeywords).toBeUndefined();
    });

    // Test case: Content with violence keywords should be detected
    it('should detect violence-related keywords', () => {
      const result = checkForHarmfulContent('How to kill a process in Linux?');
      
      expect(result.isHarmful).toBe(true);
      expect(result.reason).toBe('Input contains potentially harmful content');
      expect(result.detectedKeywords).toContain('kill');
    });

    // Test case: Content with illegal activity keywords should be detected
    it('should detect illegal activity keywords', () => {
      const result = checkForHarmfulContent('How to hack a website?');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toContain('hack');
    });

    // Test case: Content with hate speech keywords should be detected
    it('should detect hate speech keywords', () => {
      const result = checkForHarmfulContent('I hate this situation');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toContain('hate');
    });

    // Test case: Case-insensitive detection should work
    it('should detect keywords case-insensitively', () => {
      const testCases = [
        'KILL the process',
        'Kill the process',
        'kill the process',
        'KiLl the process',
      ];
      
      testCases.forEach(testCase => {
        const result = checkForHarmfulContent(testCase);
        expect(result.isHarmful).toBe(true);
        expect(result.detectedKeywords).toContain('kill');
      });
    });

    // Test case: Multiple harmful keywords should all be detected
    it('should detect multiple harmful keywords', () => {
      const result = checkForHarmfulContent('I want to steal and hack');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toHaveLength(2);
      expect(result.detectedKeywords).toContain('steal');
      expect(result.detectedKeywords).toContain('hack');
    });

    // Test case: Word boundary matching should prevent false positives
    it('should not match partial words', () => {
      // "class" contains "ass" but should not be flagged
      const result = checkForHarmfulContent('I am taking a class today');
      
      expect(result.isHarmful).toBe(false);
    });

    // Test case: Keywords in the middle of sentences should be detected
    it('should detect keywords in middle of sentences', () => {
      const result = checkForHarmfulContent('The movie had a lot of violence in it');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toContain('violence');
    });

    // Test case: Self-harm related content should be detected
    it('should detect self-harm related keywords', () => {
      const result = checkForHarmfulContent('I want to hurt myself');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toContain('hurt myself');
    });

    // Test case: Empty string should be safe
    it('should return not harmful for empty string', () => {
      const result = checkForHarmfulContent('');
      
      expect(result.isHarmful).toBe(false);
    });

    // Test case: Special characters and emojis should not cause issues
    it('should handle special characters and emojis', () => {
      const result = checkForHarmfulContent('Hello! 😊 How are you?');
      
      expect(result.isHarmful).toBe(false);
    });
  });

  describe('addHarmfulKeywords', () => {
    // Test case: Should be able to add custom keywords
    it('should add custom keywords to the filter', () => {
      const beforeCount = getHarmfulKeywords().length;
      addHarmfulKeywords(['customBadWord']);
      const afterCount = getHarmfulKeywords().length;
      
      expect(afterCount).toBe(beforeCount + 1);
      expect(getHarmfulKeywords()).toContain('customBadWord');
    });

    // Test case: Should detect newly added keywords
    it('should detect newly added harmful keywords', () => {
      addHarmfulKeywords(['testBadWord']);
      const result = checkForHarmfulContent('This contains testBadWord in it');
      
      expect(result.isHarmful).toBe(true);
      expect(result.detectedKeywords).toContain('testBadWord');
    });

    // Test case: Should be able to add multiple keywords at once
    it('should add multiple keywords at once', () => {
      const beforeCount = getHarmfulKeywords().length;
      addHarmfulKeywords(['word1', 'word2', 'word3']);
      const afterCount = getHarmfulKeywords().length;
      
      expect(afterCount).toBe(beforeCount + 3);
    });
  });

  describe('getHarmfulKeywords', () => {
    // Test case: Should return an array
    it('should return an array of keywords', () => {
      const keywords = getHarmfulKeywords();
      
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
    });

    // Test case: Should include default harmful keywords
    it('should include default harmful keywords', () => {
      const keywords = getHarmfulKeywords();
      
      expect(keywords).toContain('kill');
      expect(keywords).toContain('hack');
      expect(keywords).toContain('hate');
    });

    // Test case: Should return a copy (not allow external modification)
    it('should return a copy to prevent external modification', () => {
      const keywords1 = getHarmfulKeywords();
      const keywords2 = getHarmfulKeywords();
      
      // Modifying one should not affect the other
      keywords1.push('shouldNotAffectOriginal');
      
      expect(keywords2).not.toContain('shouldNotAffectOriginal');
    });
  });
});
