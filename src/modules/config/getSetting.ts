import { ExtensionConfig } from '../../types';
import { browserStorageLocalGet, browserStorageSyncGet } from '../browser/storage';
import { ConfKey, SettingsTypes } from '../constants';
import { getConfigCache, getConfigCacheLocal, getConfigCacheSync } from './cache';

/**
 * Retrieves a setting from the extension config.
 *
 * If either the `local` or Firefox Sync extension storage has `alwaysGetSync` set to true, then settings will always
 * come from Firefox Sync.
 *
 * TODO: Improve type assertions for stronger type safety.
 */
export const getSetting = async <T>(setting: ConfKey, type?: SettingsTypes): Promise<T | null> => {
  const cached = getConfigCache();
  if (setting in cached) return cached[setting] as T;

  // some of the settings that might create difficulties validating cached
  // settings are only accessible in the Preferences page. Those can't be
  // typically modified when the popup is open, but there is a risk of someone
  // modifying the Preferences values if the popup is opened in a dedicated
  // tab for a long time.
  switch (type) {
    case SettingsTypes.Local: {
      const cacheLocal = getConfigCacheLocal();
      if (setting in cacheLocal) return cacheLocal[setting] as T;
      return (await browserStorageLocalGet(setting))[setting] as T;
    }
    case SettingsTypes.Sync: {
      const cacheSync = getConfigCacheSync();
      if (setting in cacheSync) return cacheSync[setting] as T;
      return (await browserStorageSyncGet(setting))[setting] as T;
    }
  }

  const local = (await browserStorageLocalGet(setting)) as Partial<ExtensionConfig>;
  const sync = (await browserStorageSyncGet(setting)) as Partial<ExtensionConfig>;
  const preferSync = local.alwaysGetSync || sync.alwaysGetSync;
  const settings = preferSync ? sync : local;

  if (!settings[setting]) return null;
  return settings[setting] as T;
};
