import { ExtensionConfig } from '../types';
import { Modes, SORT_MODE_NONE, UrlMatchTypes } from './constants';
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
  mode: Modes.OPEN,
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
