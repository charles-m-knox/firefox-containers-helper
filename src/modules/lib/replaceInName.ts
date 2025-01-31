import { Container } from '../../types';
import { updateContainer } from '../browser/containers';
import { help } from '../help';
import { showPrompt, showConfirm } from '../modals/modals';

/**
 * Executes a find & replace against either a container name or predefined URL. The user will be prompted multiple
 * times.
 */
export const replaceInName = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';
  const prefill = one ? containers[0].name : '';
  const q1 = `(1/3) What case-sensitive string in ${containers.length} container name${s} would you like to search for?`;
  const find = await showPrompt(q1, 'Search String', prefill);
  if (!find) return;

  const q2 = '(2/3) What string would you like to replace it with?';
  const replace = await showPrompt(q2, 'Replace String', prefill);
  if (replace === null) return;

  const q3 = `(3/3) Replace the case-sensitive string "${find}" with "${replace}" in the name of ${containers.length} container${s}?`;
  const proceed = await showConfirm(q3, 'Confirm');
  if (!proceed) return;

  const updated: Container[] = [];
  help(`Updated ${updated.length} containers`); // in case the operation fails

  for (const container of containers) {
    // if we want to add case-insensitivity back later, uncomment this
    // const lowercontainerName = containerToUpdate.name.toLowerCase();
    // if (lowercontainerName.indexOf(findStr) !== -1) {
    // }

    if (container.name.indexOf(find) === -1) continue;

    updated.push(
      await updateContainer(container.cookieStoreId, {
        name: container.name.replaceAll(find, replace),
      }),
    );

    help(`Updated ${updated.length} containers`);
  }
};
