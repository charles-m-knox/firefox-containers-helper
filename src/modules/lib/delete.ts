import { Container, ContainerDefaultURL } from '../../types';
import { ConfKey } from '../constants';
import { showAlert, showConfirm } from '../modals/modals';
import { removeContainer } from '../browser/containers';
import { help } from '../help';
import { getSetting, setSettings } from '../config';
import { deselect } from './deselect';

/**
 * Asks if the user wants to delete multiple containers, and executes if the user says so.
 *
 * @param containers The array of containers to possibly be deleted.
 * @param prompt If false, no modals are shown.
 * @return number The number of deleted containers
 */
export const del = async (containers: Container[], prompt = true) => {
  // selection mode can sometimes lead to containers that don't exist,
  // so we will filter out containers that are undefined
  const toDelete: Container[] = [];
  const containersNoun = `container${containers.length === 1 ? '' : 's'}`;
  let deleteAllStr = `Are you sure you want to delete ${containers.length} ${containersNoun}?\n\n`;
  // limit the dialog to only showing so many lines
  const maxLines = 5;
  for (let i = 0; i < Math.min(maxLines, containers.length); i++) {
    const container = containers[i];
    if (!container) continue;
    // build confirmation dialog first
    deleteAllStr += `${container.name}\n`;
    toDelete.push(container);
  }

  if (containers.length > maxLines) {
    deleteAllStr += `\n...${containers.length - maxLines} more not shown.`;
  }

  if (toDelete.length === 0) {
    showAlert(`There aren't any valid targets to delete, so there is nothing to do.`, 'Nothing to Delete');
    return 0;
  }

  if (prompt && !(await showConfirm(deleteAllStr, 'Delete Containers?'))) return 0;
  const deleteLenStr = `Are you absolutely sure you want to delete ${containers.length} ${containersNoun}? This is not reversible.`;
  if (prompt && !(await showConfirm(deleteLenStr, 'Confirm Delete?'))) return 0;

  // proceed to delete every provided container
  const deleted: Container[] = [];
  const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
  let changed = false;

  try {
    for (const container of containers) {
      try {
        const d = await removeContainer(container.cookieStoreId);
        if (urls[container.cookieStoreId]) {
          delete urls[container.cookieStoreId];
          changed = true;
        }
        deleted.push(d);
        help(`Deleted ${deleted.length}/${containers.length} ${containersNoun}`);
      } catch (err) {
        throw `Error deleting container ${container.name} (id: ${container.cookieStoreId}): ${err}`;
      }
    }
  } finally {
    // note that despite the performance hit, it is critical to *consider*
    // saving the settings each iteration of the loop. If we instead decide
    // to only save after the loop is completed (which is faster),
    // the user might decide to close the popup window before the loop
    // is done, and we would have:
    // - deleted all of the containers leading up to the closure
    // - not persisted any default URL's to the settings
    // However, it _is_ possible to rely on the Orphan Cleanup process
    // offered in the options page to do this automatically. But, since
    // (as of 2022-10-01) this is still a new feature, the more stable
    // choice is to take the performance hit and do it right each time,
    // then automate the cleanup later. The choice has been made to warn
    // the user not to close the window before long-lived operations that
    // would likely encounter this issue (e.g for >50 containers).
    if (changed) await setSettings({ containerDefaultUrls: urls });
  }

  if (prompt) {
    await showAlert(`Deleted ${deleted.length}/${containers.length} ${containersNoun}.`, 'Completed');
  }

  await deselect();

  return deleted.length;
};
