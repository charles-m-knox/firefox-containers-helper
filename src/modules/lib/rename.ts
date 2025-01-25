import { Container } from '../../types';
import { updateContainer } from '../browser/containers';
import { help } from '../help';
import { showPrompt } from '../modals/modals';

/**
 * Renames one or more containers.
 *
 * @param containers The containers to change
 */
export const rename = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';
  const prefill = one ? containers[0].name : '';
  const rename = await showPrompt(`Rename ${containers.length} container${s} to:`, 'Rename', prefill);
  if (!rename) return;

  const updated: Container[] = [];
  for (const container of containers) {
    try {
      const update = await updateContainer(container.cookieStoreId, {
        name: rename,
      });
      updated.push(update);
      help(`Renamed ${updated.length} containers`);
    } catch (err) {
      throw `Failed to rename container ${container.name} (id ${container.cookieStoreId}): ${err}`;
    }
  }
};
