import { faker } from '@faker-js/faker';

import { getLocalStorage, updateLocalStorage } from './localStorage';

test('getLocalStorage works as expected when not empty', () => {
  const randomKey = faker.animal.dog();
  const randomValue = { value: faker.animal.fish() };
  // Set random localStorage value
  updateLocalStorage(randomKey, randomValue);

  expect(getLocalStorage(randomKey, '')).toStrictEqual(randomValue);
});

test('getLocalStorage works as expected when empty', () => {
  const randomEmptyKey = faker.animal.crocodilia();

  expect(getLocalStorage(randomEmptyKey, '')).toBe('');
});
