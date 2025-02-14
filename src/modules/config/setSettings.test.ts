import { setSettings } from './setSettings';
import { getSetting } from './getSetting';
import { getFakeExtensionConfig } from '../testutil';
import { browserStorageLocalSet, browserStorageSyncSet } from '../browser/storage';
import { getSettings } from './getSettings';

jest.mock('./getSetting', () => ({
  getSetting: jest.fn().mockImplementation(),
}));

jest.mock('./getSettings', () => ({
  getSettings: jest.fn().mockImplementation(),
}));

jest.mock('../browser/storage', () => ({
  browserStorageLocalSet: jest.fn().mockImplementation(),
  browserStorageSyncSet: jest.fn().mockImplementation(),
}));

describe('setSettings', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sets sync settings but not local', async () => {
    const updates = getFakeExtensionConfig();

    // the first call is to retrieve the sync setting, and the second call is for the local setting
    (getSetting as jest.Mock).mockImplementationOnce(async () => true);
    (getSetting as jest.Mock).mockImplementationOnce(async () => false);

    await setSettings(updates);

    expect(browserStorageLocalSet).toHaveBeenCalledTimes(1);
    expect(browserStorageSyncSet).toHaveBeenCalledTimes(1);
    expect(browserStorageLocalSet).toHaveBeenNthCalledWith(1, updates);
    expect(browserStorageSyncSet).toHaveBeenNthCalledWith(1, updates);
    expect(getSettings).toHaveBeenCalledTimes(1);
  });

  it('sets local settings but not sync', async () => {
    const updates = getFakeExtensionConfig();

    (getSetting as jest.Mock).mockImplementationOnce(async () => false);
    (getSetting as jest.Mock).mockImplementationOnce(async () => false);

    await setSettings(updates);

    expect(browserStorageSyncSet).toHaveBeenCalledTimes(0);
    expect(browserStorageLocalSet).toHaveBeenCalledTimes(1);
    expect(browserStorageLocalSet).toHaveBeenNthCalledWith(1, updates);
    expect(getSettings).toHaveBeenCalledTimes(1);
  });

  it('sets local settings but not sync', async () => {
    const updates = getFakeExtensionConfig();

    (getSetting as jest.Mock).mockImplementationOnce(async () => false);
    (getSetting as jest.Mock).mockImplementationOnce(async () => true);

    await setSettings(updates);

    expect(browserStorageSyncSet).toHaveBeenCalledTimes(1);
    expect(browserStorageLocalSet).toHaveBeenCalledTimes(1);
    expect(browserStorageLocalSet).toHaveBeenNthCalledWith(1, updates);
    expect(browserStorageSyncSet).toHaveBeenNthCalledWith(1, updates);
    expect(getSettings).toHaveBeenCalledTimes(1);
  });
});
