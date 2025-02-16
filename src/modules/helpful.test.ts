import { helpfulStrings } from '../strings/strings';
import { ConfKey, Mode } from './constants';
import { helpful } from './helpful';
import { help } from './help';
import { getSetting } from './config/getSetting';

jest.mock('./help', () => ({
  help: jest.fn().mockImplementation(() => {}),
}));

jest.mock('./config/getSetting', () => ({
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
    mode?: Mode | null;
    getSettingMock?: Mode;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'retrieves help mode from mocked settings when the mode is null',
      mode: null,
      getSettingMock: Mode.SET_URL,
      expected: helpfulStrings[Mode.SET_URL],
    },
    {
      name: 'retrieves help mode from mocked settings when the mode is not defined',
      mode: undefined,
      getSettingMock: Mode.REPLACE_IN_URL,
      expected: helpfulStrings[Mode.REPLACE_IN_URL],
    },
    {
      name: 'sets help for the SET_URL mode',
      mode: Mode.SET_URL,
      expected: helpfulStrings[Mode.SET_URL],
    },
    {
      name: 'sets help for the SET_NAME mode',
      mode: Mode.SET_NAME,
      expected: helpfulStrings[Mode.SET_NAME],
    },
    {
      name: 'sets help for the REPLACE_IN_URL mode',
      mode: Mode.REPLACE_IN_URL,
      expected: helpfulStrings[Mode.REPLACE_IN_URL],
    },
    {
      name: 'sets help for the REPLACE_IN_NAME mode',
      mode: Mode.REPLACE_IN_NAME,
      expected: helpfulStrings[Mode.REPLACE_IN_NAME],
    },
    {
      name: 'sets help for the SET_ICON mode',
      mode: Mode.SET_ICON,
      expected: helpfulStrings[Mode.SET_ICON],
    },
    {
      name: 'sets help for the SET_COLOR mode',
      mode: Mode.SET_COLOR,
      expected: helpfulStrings[Mode.SET_COLOR],
    },
    {
      name: 'sets help for the DUPLICATE mode',
      mode: Mode.DUPLICATE,
      expected: helpfulStrings[Mode.DUPLICATE],
    },
    {
      name: 'sets help for the DELETE mode',
      mode: Mode.DELETE,
      expected: helpfulStrings[Mode.DELETE],
    },
    {
      name: 'sets help for the REFRESH mode',
      mode: Mode.REFRESH,
      expected: helpfulStrings[Mode.REFRESH],
    },
    {
      name: 'sets help for an empty input',
      mode: 'fake value' as Mode,
      expected: '',
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, async () => {
      if (test.getSettingMock) {
        (getSetting as jest.Mock).mockImplementationOnce(async (): Promise<Mode> => test.getSettingMock as Mode);
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
