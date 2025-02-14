import { ExtensionConfig } from '../../types';
import { ConfKey, SettingsTypes } from '../constants';
import { browserStorageLocalSet, browserStorageSyncSet } from '../browser/storage';
import { getSetting } from '../config';
import { getSettings } from './getSettings';

export const setSettings = async (updates: Partial<ExtensionConfig>) => {
  const sync = (await getSetting<boolean>(ConfKey.alwaysSetSync, SettingsTypes.Sync)) === true;
  const local = (await getSetting<boolean>(ConfKey.alwaysSetSync, SettingsTypes.Local)) === true;
  await browserStorageLocalSet(updates);
  if (sync || local) await browserStorageSyncSet(updates);
  // refresh the cache any time this function is called
  await getSettings();
};
