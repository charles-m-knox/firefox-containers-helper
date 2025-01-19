import { helpfulStrings } from '../strings/strings';
import { Modes } from './constants';
import { helpful } from './helpful';
import { help } from './help';

jest.mock('./help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

describe('helpful', () => {
  interface Test {
    name: string;
    mode?: Modes;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'sets help for the SET_URL mode',
      mode: Modes.SET_URL,
      expected: helpfulStrings[Modes.SET_URL],
    },
    {
      name: 'sets help for the SET_NAME mode',
      mode: Modes.SET_NAME,
      expected: helpfulStrings[Modes.SET_NAME],
    },
    {
      name: 'sets help for the REPLACE_IN_URL mode',
      mode: Modes.REPLACE_IN_URL,
      expected: helpfulStrings[Modes.REPLACE_IN_URL],
    },
    {
      name: 'sets help for the REPLACE_IN_NAME mode',
      mode: Modes.REPLACE_IN_NAME,
      expected: helpfulStrings[Modes.REPLACE_IN_NAME],
    },
    {
      name: 'sets help for the SET_ICON mode',
      mode: Modes.SET_ICON,
      expected: helpfulStrings[Modes.SET_ICON],
    },
    {
      name: 'sets help for the SET_COLOR mode',
      mode: Modes.SET_COLOR,
      expected: helpfulStrings[Modes.SET_COLOR],
    },
    {
      name: 'sets help for the DUPLICATE mode',
      mode: Modes.DUPLICATE,
      expected: helpfulStrings[Modes.DUPLICATE],
    },
    {
      name: 'sets help for the DELETE mode',
      mode: Modes.DELETE,
      expected: helpfulStrings[Modes.DELETE],
    },
    {
      name: 'sets help for the REFRESH mode',
      mode: Modes.REFRESH,
      expected: helpfulStrings[Modes.REFRESH],
    },
    {
      name: 'sets help for an empty input',
      mode: 'fake value' as Modes,
      expected: '',
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, () => {
      helpful(test.mode);
      expect(help).toHaveBeenCalled();
      expect(help).toHaveBeenCalledWith(test.expected);
    }),
  );
});
