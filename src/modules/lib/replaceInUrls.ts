import { Container, ContainerDefaultURL } from '../../types';
import { getSetting } from '../config/getSetting';
import { setSettings } from '../config/setSettings';
import { ConfKey } from '../constants';
import { help } from '../help';
import { showPrompt, showConfirm } from '../modals/modals';

/**
 * Executes a find & replace against either a container name or predefined URL. The user will be prompted multiple
 * times.
 */
export const replaceInUrls = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';
  let prefill = '';
  const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
  if (one) {
    const container = containers[0];
    const containerUrl = urls[container.cookieStoreId];
    if (urls[container.cookieStoreId]) prefill = containerUrl;
  }

  const q1 = `(1/3) What case-insensitive string in ${containers.length} container default URL${s} would you like to search for?`;
  const find = await showPrompt(q1, 'Search String', prefill);
  if (!find) return;

  const q2 = '(2/3) What string would you like to replace it with?';
  const replace = await showPrompt(q2, 'Replace String', prefill);
  if (replace === null) return;

  const q3 = `(3/3) Replace the case-insensitive string "${find}" with "${replace}" in the default URL of ${containers.length} container${s}}?`;
  const proceed = await showConfirm(q3, 'Confirm URL Replace');
  if (!proceed) return;

  const updated: Container[] = [];
  help(`Updated ${updated.length} containers`); // in case the operation fails
  let changed = false;

  try {
    for (const container of containers) {
      // retrieve the lowercase URL for the container by first
      // retrieving its unique ID
      const containerId = container.cookieStoreId;
      const url = urls[containerId];
      // check if there is actually a default URL set for this container
      if (!url) continue;

      // there is a default URL, so proceed to find, replace & update it
      const lowered = url.toLowerCase();
      if (lowered.indexOf(find) === -1) continue;

      const newUrlStr = lowered.replaceAll(find, replace);

      urls[containerId] = newUrlStr;
      changed = true;

      updated.push(container);

      help(`Updated ${updated.length} containers`);
    }
  } catch (err) {
    throw `Failed to rename container URL${s}}: ${err}`;
  } finally {
    if (changed) await setSettings({ containerDefaultUrls: urls });
  }
};
