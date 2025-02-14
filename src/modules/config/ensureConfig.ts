import { defaultConfig, getSettings } from '../config';
import { setConfigCache } from './cache';
import { setSettings } from './setSettings';

/**
 * Ensures that at a fresh config is set, if there isn't an existing config.
 *
 * Do not run this more than once - only run upon app load. Running multiple
 * times may have unexpected side effects.
 */
export const ensureConfig = async () => {
  const settings = await getSettings();
  const mergedSettings = {
    ...defaultConfig,
    ...settings,
  };
  setConfigCache({ ...mergedSettings });
  await setSettings(mergedSettings);
};
