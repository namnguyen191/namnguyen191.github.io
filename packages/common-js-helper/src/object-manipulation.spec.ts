import { removeEmptyKeys } from './object-manipulation.js';

describe('removeEmptyKeys', () => {
  it('should work remove empty keys', () => {
    let testObj = {
      field1: 'Hi',
      field2: undefined,
      field3: {
        field4: null,
        field5: true,
      },
    };
    const expectedObj = {
      field1: 'Hi',
      field3: {
        field5: true,
      },
    };

    // oxlint-disable-next-line typescript/no-unsafe-type-assertion typescript/no-explicit-any
    testObj = removeEmptyKeys(testObj) as any;

    expect(testObj).toEqual(expectedObj);
  });
});
