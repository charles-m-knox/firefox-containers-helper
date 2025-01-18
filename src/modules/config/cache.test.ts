import { MODES } from '../constants';
import {
  setConfigCache,
  getConfigCache,
  setConfigCacheLocal,
  getConfigCacheLocal,
  setConfigCacheSync,
  getConfigCacheSync,
} from './cache';

describe('configCache', () => {
  it('caches values as expected', () => {
    setConfigCache({ alwaysGetSync: true });
    const cache1 = getConfigCache();
    expect(cache1).toStrictEqual({ alwaysGetSync: true });
    setConfigCacheLocal({ mode: MODES.DELETE });
    const cache2 = getConfigCacheLocal();
    expect(cache2).toStrictEqual({ mode: MODES.DELETE });
    setConfigCacheSync({ lastQuery: 'foo' });
    const cache3 = getConfigCacheSync();
    expect(cache3).toStrictEqual({ lastQuery: 'foo' });
  });
});
