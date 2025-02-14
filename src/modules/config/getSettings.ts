import { getLocalSettings, getSyncSettings } from '../config';
import { setConfigCache, setConfigCacheLocal, setConfigCacheSync } from './cache';

/**
 * Returns all settings, depending on whether the user prefers Sync or not.
 */
export const getSettings = async () => {
  const local = await getLocalSettings();
  const sync = await getSyncSettings();
  const preferSync = sync.alwaysGetSync || local.alwaysGetSync;
  const settings = preferSync ? sync : local;

  setConfigCache({ ...settings });
  setConfigCacheLocal({ ...local });
  setConfigCacheSync({ ...sync });

  return settings;
};
