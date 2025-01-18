import { HELP_MESSAGES } from './constants';
import { getElemNullable } from './get';
import { help } from './help';
import { getRandomIndex } from './helpers/random';

jest.mock('./helpers/random', () => ({
  getRandomIndex: jest.fn().mockImplementation(() => 5),
}));

describe('help', () => {
  interface Test {
    name: string;
    message: string;
    isPresent: boolean;
    innerHTML: string;
    expected: string;
    element?: () => HTMLSpanElement | null;
  }

  const tests: Test[] = [
    {
      name: 'sets help to a random message',
      message: '',
      isPresent: true,
      innerHTML: `<span id="helpText"></span>`,
      expected: HELP_MESSAGES[5],
      element: () => getElemNullable<HTMLSpanElement>('helpText'),
    },
    {
      name: 'sets help to a real message',
      message: 'Foo!',
      isPresent: true,
      innerHTML: `<span id="helpText"></span>`,
      expected: 'Foo!',
      element: () => getElemNullable<HTMLSpanElement>('helpText'),
    },
    {
      name: 'does not set help since the element is not present',
      message: '',
      isPresent: false,
      innerHTML: `<span id="foo"></span>`,
      expected: '',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  tests.forEach((test) =>
    it(test.name, () => {
      document.body.innerHTML = test.innerHTML;
      help(test.message);
      if (!test.message) expect(getRandomIndex).toHaveBeenCalled();
      if (test.isPresent && test.element) {
        const actual = test.element();
        if (!actual) throw 'test element was not found';
        expect(actual.innerText).toBe(test.expected);
      }
    }),
  );
});
