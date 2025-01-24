import { ExtensionConfig } from '../../types';
import { setSettings, getSettings, defaultConfig } from '../config';
import { setConfigCache } from './cache';
import { ensureConfig } from './ensureConfig';

jest.mock('./cache', () => ({
  setConfigCache: jest.fn().mockImplementation(() => {}),
}));

jest.mock('../config', () => ({
  setSettings: jest.fn().mockImplementation(() => {}),
  getSettings: jest.fn().mockImplementation(async () => {
    const settings: ExtensionConfig = {
      ...defaultConfig,
      lastQuery: 'foo',
    };

    return settings;
  }),
}));

describe('ensureConfig', () => {
  interface Test {
    name: string;
    expected: ExtensionConfig;
  }

  const tests: Test[] = [
    {
      name: 'ensures that at a fresh config is set, if there is not an existing config attempt 1/3',
      expected: {
        ...defaultConfig,
        lastQuery: 'foo',
      },
    },
  ];

  afterEach(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, async () => {
      await ensureConfig();
      expect(getSettings).toHaveBeenCalledTimes(1);
      expect(setSettings).toHaveBeenCalledTimes(1);
      expect(setConfigCache).toHaveBeenCalledTimes(1);
      expect(setSettings).toHaveBeenCalledWith(test.expected);
    }),
  );
});