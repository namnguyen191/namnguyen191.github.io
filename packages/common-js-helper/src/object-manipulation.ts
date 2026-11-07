import { isNil, isPlainObject, omitBy } from 'lodash-es';
import type { UnknownRecord } from 'type-fest';

// Go through an object recursively and remove all key that has "null" or "undefined" value, return a new object
export const removeEmptyKeys = (obj: UnknownRecord): UnknownRecord => {
  const newObj = structuredClone(obj);

  const recursiveRemoval = (tempObj: UnknownRecord): UnknownRecord => {
    // Needs to modify the object for recursion
    // oxlint-disable-next-line no-param-reassign
    tempObj = omitBy<UnknownRecord>(tempObj, isNil);
    for (const [key, val] of Object.entries(tempObj)) {
      if (isPlainObject(val)) {
        // oxlint-disable-next-line typescript/no-unsafe-type-assertion
        tempObj[key] = recursiveRemoval(val as UnknownRecord);
      }
    }
    return tempObj;
  };

  return recursiveRemoval(newObj);
};
