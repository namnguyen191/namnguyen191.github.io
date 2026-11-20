// oxlint-disable no-magic-numbers
import { ZodNonEmptyPrimitive, ZodObjectType } from './custom-zod-types.js';

describe('Custom zod types', () => {
  describe('ZodNonEmptyPrimitive', () => {
    it('should parse js primitive value', () => {
      const primitives: unknown[] = ['test', 1, true, Symbol('test'), 9_007_199_254_740_991n];

      primitives.forEach((pri) => ZodNonEmptyPrimitive.parse(pri));
    });

    it('should throw error for empty js primitive value', () => {
      const emptyPrimitives: unknown[] = [null, undefined];

      for (const pri of emptyPrimitives) {
        expect(() => ZodNonEmptyPrimitive.parse(pri)).toThrowError();
      }
    });

    it('should throw error for non primitive value', () => {
      expect(() => ZodNonEmptyPrimitive.parse({ name: 'Nam' })).toThrowError();
    });
  });

  describe('ZodObjectType', () => {
    it('should parse object', () => {
      ZodObjectType.parse({
        name: 'test',
      });
    });

    it('should throw error for non-object value', () => {
      const nonObjects: unknown[] = [
        'test',
        1,
        true,
        Symbol('test'),
        9_007_199_254_740_991n,
        Array.from({ length: 1 }),
      ];

      for (const nonOb of nonObjects) {
        expect(() => ZodObjectType.parse(nonOb)).toThrowError();
      }
    });
  });
});
