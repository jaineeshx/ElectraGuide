const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const formatPinCode = (pin) => pin.replace(/\s/g, '');

describe('Utility Functions', () => {
  describe('validateEmail', () => {
    it('returns true for valid email', () => expect(validateEmail('test@test.com')).toBe(true));
    it('returns false for invalid email', () => expect(validateEmail('test@')).toBe(false));
    it('returns false for missing @', () => expect(validateEmail('test.com')).toBe(false));
    it('returns false for empty string', () => expect(validateEmail('')).toBe(false));
  });

  describe('formatPinCode', () => {
    it('removes spaces from pin code', () => expect(formatPinCode('110 001')).toBe('110001'));
    it('works with no spaces', () => expect(formatPinCode('110001')).toBe('110001'));
    it('works with multiple spaces', () => expect(formatPinCode('1 1 0 0 0 1')).toBe('110001'));
  });
});
