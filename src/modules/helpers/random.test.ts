import { getRandomIndex } from './random';

describe('getRandomIndex', () => {
  interface Test {
    name: string;
    length: number;
    random: number;
    expected: number;
  }

  const tests: Test[] = [
    {
      name: 'gets a random index 0',
      length: 10,
      random: 0,
      expected: 0,
    },
    {
      name: 'gets a random index 1',
      length: 10,
      random: 0.12381274,
      expected: 1,
    },
    {
      name: 'gets a random index 2',
      length: 10,
      random: 0.2234859723,
      expected: 2,
    },
    {
      name: 'gets a random index 3',
      length: 10,
      random: 0.398798797549,
      expected: 3,
    },
    {
      name: 'gets a random index 4',
      length: 10,
      random: 0.4943875,
      expected: 4,
    },
    {
      name: 'gets a random index 5',
      length: 10,
      random: 0.58120931,
      expected: 5,
    },
    {
      name: 'gets a random index 6',
      length: 10,
      random: 0.6098234,
      expected: 6,
    },
    {
      name: 'gets a random index 7',
      length: 10,
      random: 0.7123812,
      expected: 7,
    },
    {
      name: 'gets a random index 8',
      length: 10,
      random: 0.843875,
      expected: 8,
    },
    {
      name: 'gets a random index 9',
      length: 10,
      random: 0.99874123,
      expected: 9,
    },
  ];

  const originalMathRandom = Math.random;

  afterEach(() => {
    Math.random = originalMathRandom;
  });

  tests.forEach((test) =>
    it(test.name, () => {
      Math.random = () => test.random;
      expect(getRandomIndex(test.length)).toBe(test.expected);
    }),
  );
});
