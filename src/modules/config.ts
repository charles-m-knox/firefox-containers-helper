import { ExtensionConfig } from '../types';
import { CONF, MODES, SettingsTypes, SORT_MODE_NONE, UrlMatchTypes } from './constants';
import {
  getConfigCache,
  getConfigCacheLocal,
  getConfigCacheSync,
  setConfigCache,
  setConfigCacheLocal,
  setConfigCacheSync,
} from './config/cache';
import {
  browserStorageLocalGet,
  browserStorageLocalSet,
  browserStorageSyncGet,
  browserStorageSyncSet,
} from './browser/storage';

export const defaultConfig: ExtensionConfig = {
  windowStayOpenState: true,
  selectionMode: false,
  sort: SORT_MODE_NONE,
  openCurrentPage: false,
  mode: MODES.OPEN,
  lastQuery: '',
  containerDefaultUrls: {},
  selectedContextIndices: {},
  lastSelectedContextIndex: -1,
  alwaysGetSync: false,
  alwaysSetSync: false,
  neverConfirmOpenNonHttpUrls: false,
  neverConfirmSaveNonHttpUrls: false,
  openCurrentTabUrlOnMatch: UrlMatchTypes.empty,
};

/**
 * Returns all settings, depending on whether the user prefers Sync or not.
 */
export const getSettings = async () => {
  const local = (await browserStorageLocalGet()) as ExtensionConfig;
  const sync = (await browserStorageSyncGet()) as ExtensionConfig;
  const preferSync = sync.alwaysGetSync || local.alwaysGetSync;
  const settings = preferSync ? sync : local;

  setConfigCache({ ...settings });
  setConfigCacheLocal({ ...local });
  setConfigCacheSync({ ...sync });

  return settings;
};

/**
 * Returns only sync settings. Do not use unless you specifically need them, such as on the Preferences page.
 *
 * Prefer to use the `getSettings` where possible, since it automatically determines whether or not to use sync/local.
 */
export const getSyncSettings = async () => (await browserStorageSyncGet()) as ExtensionConfig;

/**
 * Returns only local settings. Do not use unless you specifically need them, such as on the Preferences page.
 *
 * Prefer to use the `getSettings` where possible, since it automatically determines whether or not to use sync/local.
 */
export const getLocalSettings = async () => (await browserStorageLocalGet()) as ExtensionConfig;

/**
 * Saves only sync settings. Do not use unless you specifically need them, such as on the Preferences page.
 *
 * Prefer to use the `getSettings` where possible, since it automatically determines whether or not to use sync/local.
 */
export const setSyncSettings = async (updates: Partial<ExtensionConfig>) => await browserStorageSyncSet(updates);

/**
 * Saves only local settings. Do not use unless you specifically need them, such as on the Preferences page.
 *
 * Prefer to use the `getSettings` where possible, since it automatically determines whether or not to use sync/local.
 */
export const setLocalSettings = async (updates: Partial<ExtensionConfig>) => await browserStorageLocalSet(updates);

/**
 * Retrieves a setting from the extension config.
 *
 * If either the `local` or Firefox Sync extension storage has `alwaysGetSync` set to true, then settings will always
 * come from Firefox Sync.
 *
 * TODO: make this generic?
 */
export const getSetting = async (setting: CONF, type?: SettingsTypes): Promise<unknown> => {
  const cached = getConfigCache();
  if (setting in cached) return cached[setting];

  // some of the settings that might create difficulties validating cached
  // settings are only accessible in the Preferences page. Those can't be
  // typically modified when the popup is open, but there is a risk of someone
  // modifying the Preferences values if the popup is opened in a dedicated
  // tab for a long time.
  switch (type) {
    case SettingsTypes.Local: {
      const cacheLocal = getConfigCacheLocal();
      if (setting in cacheLocal) return cacheLocal[setting];
      return (await browserStorageLocalGet(setting))[setting];
    }
    case SettingsTypes.Sync: {
      const cacheSync = getConfigCacheSync();
      if (setting in cacheSync) return cacheSync[setting];
      return (await browserStorageSyncGet(setting))[setting];
    }
  }

  const local = (await browserStorageLocalGet(setting)) as Partial<ExtensionConfig>;
  const sync = (await browserStorageSyncGet(setting)) as Partial<ExtensionConfig>;
  const preferSync = local.alwaysGetSync || sync.alwaysGetSync;
  const settings = preferSync ? sync : local;

  if (!settings[setting]) return null;
  return settings[setting];
};

/**
 * Pushes settings to the extension config.
 *
 * If either the `local` or Firefox Sync extension storage has `alwaysSetSync` set to true, then settings will always go
 * to local AND Firefox Sync.
 */
export const setSettings = async (updates: Partial<ExtensionConfig>) => {
  const sync = (await getSetting(CONF.alwaysSetSync, SettingsTypes.Sync)) === true;
  const local = (await getSetting(CONF.alwaysSetSync, SettingsTypes.Local)) === true;
  await browserStorageLocalSet(updates);
  if (sync || local) await browserStorageSyncSet(updates);
  // refresh the cache any time this function is called
  await getSettings();
};
