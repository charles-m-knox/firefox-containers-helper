import { ExtensionConfig } from '../../types';

let cached: Partial<ExtensionConfig> = {};
let cacheLocal: Partial<ExtensionConfig> = {};
let cacheSync: Partial<ExtensionConfig> = {};

export const setConfigCache = (updated: Partial<ExtensionConfig>) => {
  cached = { ...updated };
};

/**
 * Queries against the `browser.storage` API might be slow, so use cached results if possible - note that the cached
 * object should get updated automatically any setting is changed, so generally it will always be up to date.
 */
export const getConfigCache = () => cached;

export const setConfigCacheLocal = (updated: Partial<ExtensionConfig>) => {
  cacheLocal = { ...updated };
};

export const getConfigCacheLocal = () => cacheLocal;

export const setConfigCacheSync = (updated: Partial<ExtensionConfig>) => {
  cacheSync = { ...updated };
};

export const getConfigCacheSync = () => cacheSync;
