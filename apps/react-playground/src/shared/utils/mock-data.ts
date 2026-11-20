// oxlint-disable no-magic-numbers
import { faker } from '@faker-js/faker';

import type { ObjectValue } from './types-helper';

// Use type to avoid index signature issue
// oxlint-disable-next-line typescript/consistent-type-definitions
export type MockUserCreditCardData = {
  id: number;
  firstName: string;
  lastName: string;
  outstandingAmount: number;
  upCommingDueDate: string;
  mostRecentMissedPaymentDate: string | null;
};
export type MockUserCreditCardDataValue = ObjectValue<MockUserCreditCardData>;
export const generateMockUserCreditCardData = (numRecords: number): MockUserCreditCardData[] =>
  Array.from({ length: numRecords }, (_, index) => ({
    id: index + 1,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    outstandingAmount: Number.parseFloat((Math.random() * 5000).toFixed(2)),
    upCommingDueDate: faker.date.future().toISOString(),
    mostRecentMissedPaymentDate: Math.random() < 0.5 ? faker.date.past().toISOString() : null,
  }));
