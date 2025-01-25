import { Container } from '../../types';
import { help } from '../help';
import { showConfirm, showAlert } from '../modals/modals';
import { del } from './delete';
import { duplicate } from './duplicate';

/**
 * Duplicates and then deletes containers.
 *
 * @return An array of 2 numbers: the first being the number of deleted containers, and the second being the number of
 * created containers.
 */
export const refresh = async (containers: Container[]) => {
  const s = containers.length === 1 ? '' : 's';
  const msg = `Delete and re-create ${containers.length} container${s}? Basic properties, such as color, URL, name, and icon are kept, but not cookies or other site information. The ordering of the container${s} may not be preserved. This will operate in two steps: duplicate, then delete.`;
  const title = 'Delete and Re-create?';
  const confirmed = await showConfirm(msg, title);
  if (!confirmed) return [0, 0] as const;

  const msg2 = `This is a destructive action and will delete actual cookie and other related site data for ${containers.length} container${s}! Are you absolutely sure?`;
  const really = await showConfirm(msg2, 'Really Delete and Re-create?');
  if (!really) return [0, 0] as const;

  const duplicated = await duplicate(containers, false);
  const deleted = await del(containers, false);
  const s1 = deleted === 1 ? '' : 's';
  const done = `Deleted ${deleted} and re-created ${duplicated} container${s1}.`;
  help(done);
  await showAlert(done, 'Deleted and Recreated');
  return [deleted, duplicated] as const;
};
