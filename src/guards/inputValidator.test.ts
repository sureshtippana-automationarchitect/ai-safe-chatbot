/**
 * Unit Tests for Input Validator
 * 
 * These tests verify that the input validation logic works correctly
 * for various scenarios including edge cases.
 */

import { validateInput, DEFAULT_VALIDATION_CONFIG } from './inputValidator';

describe('Input Validator', () => {
  describe('validateInput', () => {
    // Test case: Valid input should pass validation
    it('should return valid for proper input', () => {
      const result = validateInput('Hello, how are you?', { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Null input should fail validation
    it('should reject null input', () => {
      const result = validateInput(null as any, { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be null or undefined');
    });

    // Test case: Undefined input should fail validation
    it('should reject undefined input', () => {
      const result = validateInput(undefined as any, { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be null or undefined');
    });

    // Test case: Empty string should fail validation
    it('should reject empty string', () => {
      const result = validateInput('', { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    // Test case: Whitespace-only input should fail validation
    it('should reject whitespace-only input', () => {
      const result = validateInput('   ', { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    // Test case: Input with only tabs and newlines should fail
    it('should reject input with only tabs and newlines', () => {
      const result = validateInput('\t\n\r', { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input cannot be empty');
    });

    // Test case: Input exceeding max length should fail
    it('should reject input exceeding max length', () => {
      const longInput = 'a'.repeat(501);
      const result = validateInput(longInput, { maxLength: 500 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input exceeds maximum length of 500 characters');
    });

    // Test case: Input exactly at max length should pass
    it('should accept input at exactly max length', () => {
      const exactInput = 'a'.repeat(500);
      const result = validateInput(exactInput, { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Input just under max length should pass
    it('should accept input just under max length', () => {
      const input = 'a'.repeat(499);
      const result = validateInput(input, { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Single character input should pass
    it('should accept single character input', () => {
      const result = validateInput('a', { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Input with leading/trailing whitespace should be trimmed
    it('should trim input before validation', () => {
      const result = validateInput('  hello  ', { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Special characters should be accepted
    it('should accept input with special characters', () => {
      const result = validateInput('Hello! How are you? 😊', { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Multi-line input should be accepted
    it('should accept multi-line input', () => {
      const multilineInput = 'Line 1\nLine 2\nLine 3';
      const result = validateInput(multilineInput, { maxLength: 500 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    // Test case: Custom max length should be respected
    it('should respect custom max length', () => {
      const result = validateInput('Hello World', { maxLength: 5 });
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Input exceeds maximum length of 5 characters');
    });
  });

  describe('DEFAULT_VALIDATION_CONFIG', () => {
    // Test case: Default config should have correct max length
    it('should have maxLength of 500', () => {
      expect(DEFAULT_VALIDATION_CONFIG.maxLength).toBe(500);
    });
  });
});
