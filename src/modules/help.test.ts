import { helpfulStrings } from '../strings/strings';
import { MODES } from './constants';
import { helpful } from './html';
import { help } from './help';

jest.mock('./help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

describe('helpful', () => {
  interface Test {
    name: string;
    mode?: MODES;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'sets help for the SET_URL mode',
      mode: MODES.SET_URL,
      expected: helpfulStrings[MODES.SET_URL],
    },
    {
      name: 'sets help for the SET_NAME mode',
      mode: MODES.SET_NAME,
      expected: helpfulStrings[MODES.SET_NAME],
    },
    {
      name: 'sets help for the REPLACE_IN_URL mode',
      mode: MODES.REPLACE_IN_URL,
      expected: helpfulStrings[MODES.REPLACE_IN_URL],
    },
    {
      name: 'sets help for the REPLACE_IN_NAME mode',
      mode: MODES.REPLACE_IN_NAME,
      expected: helpfulStrings[MODES.REPLACE_IN_NAME],
    },
    {
      name: 'sets help for the SET_ICON mode',
      mode: MODES.SET_ICON,
      expected: helpfulStrings[MODES.SET_ICON],
    },
    {
      name: 'sets help for the SET_COLOR mode',
      mode: MODES.SET_COLOR,
      expected: helpfulStrings[MODES.SET_COLOR],
    },
    {
      name: 'sets help for the DUPLICATE mode',
      mode: MODES.DUPLICATE,
      expected: helpfulStrings[MODES.DUPLICATE],
    },
    {
      name: 'sets help for the DELETE mode',
      mode: MODES.DELETE,
      expected: helpfulStrings[MODES.DELETE],
    },
    {
      name: 'sets help for the REFRESH mode',
      mode: MODES.REFRESH,
      expected: helpfulStrings[MODES.REFRESH],
    },
    {
      name: 'sets help for an empty input',
      mode: 'fake value' as MODES,
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
