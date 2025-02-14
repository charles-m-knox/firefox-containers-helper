import { ExtensionConfig } from '../../types';
import { getContainer } from '../browser/containers';

/**
 * Returns the number of dirty entries in the config - e.g. container URLs
 * that no longer have containers (orphaned).
 *
 * @param conf
 * @return The number of dirty entries in the config.
 */
export const checkDirty = async (conf: ExtensionConfig) => {
  if (!conf?.containerDefaultUrls) return 0;
  const removed: string[] = [];
  for (const id in conf.containerDefaultUrls) {
    try {
      const context = await getContainer(id);

      if (!context) removed.push(id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      removed.push(id);
    }
  }

  return removed.length;
};
