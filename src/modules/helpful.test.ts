import { helpfulStrings } from '../strings/strings';
import { ConfKey, Modes } from './constants';
import { helpful } from './helpful';
import { help } from './help';
import { getSetting } from './config';

jest.mock('./help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('./config', () => ({
  getSetting: jest.fn().mockImplementation(() => undefined),
}));

describe('helpful', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  interface Test {
    name: string;
    mode?: Modes | null;
    getSettingMock?: Modes;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'retrieves help mode from mocked settings when the mode is null',
      mode: null,
      getSettingMock: Modes.SET_URL,
      expected: helpfulStrings[Modes.SET_URL],
    },
    {
      name: 'retrieves help mode from mocked settings when the mode is not defined',
      mode: undefined,
      getSettingMock: Modes.REPLACE_IN_URL,
      expected: helpfulStrings[Modes.REPLACE_IN_URL],
    },
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
    it(test.name, async () => {
      if (test.getSettingMock) {
        (getSetting as jest.Mock).mockImplementationOnce(async (): Promise<Modes> => test.getSettingMock as Modes);
      }

      await helpful(test.mode);

      if (!test.mode) {
        expect(getSetting).toHaveBeenNthCalledWith(1, ConfKey.mode);
      }
      expect(help).toHaveBeenCalledTimes(1);
      expect(help).toHaveBeenCalledWith(test.expected);
    }),
  );
});
