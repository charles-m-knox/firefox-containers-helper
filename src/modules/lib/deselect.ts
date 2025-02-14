import { setSettings } from '../config/setSettings';

/**
 * Empties out the list of containers to act on when the "selection mode" is enabled, and persists the change to the
 * configuration.
 */
export const deselect = async () =>
  await setSettings({
    selectedContextIndices: {},
    lastSelectedContextIndex: 0,
  });
