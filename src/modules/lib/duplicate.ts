import { Container, ContainerDefaultURL } from '../../types';
import { createContainer } from '../browser/containers';
import { getSetting } from '../config';
import { ConfKey } from '../constants';
import { help } from '../help';
import { deselect } from './deselect';
import { showConfirm } from '../modals/modals';
import { setUrls } from './setUrls';

/**
 * Duplicates one or more containers.
 *
 * @param prompt If false, no modals are shown.
 */
export const duplicate = async (containers: Container[], prompt = true): Promise<number> => {
  const s = containers.length === 1 ? '' : 's';
  const question = `Are you sure you want to duplicate ${containers.length} containers?`;

  // only ask if there are multiple containers to duplicate
  if (containers.length > 1 && prompt && !(await showConfirm(question, 'Confirm Duplicate'))) return 0;

  const duplicated: Container[] = [];
  const urlsToSet: string[] = [];

  // if the containers have default URL associations, we need to update those too
  const urls = (await getSetting(ConfKey.containerDefaultUrls)) as ContainerDefaultURL;

  try {
    for (const container of containers) {
      const newContainer = {
        color: container.color,
        icon: container.icon,
        name: container.name,
      };

      try {
        const created = await createContainer(newContainer);
        const urlToSet = urls[container.cookieStoreId] || 'none';
        duplicated.push(created);
        urlsToSet.push(urlToSet);
      } catch (err) {
        throw `error when duplicating container ${container.name}: ${err}`;
      } finally {
        help(`Creating ${duplicated.length}/${containers.length} container${s}...`);
      }
    }
  } catch (err) {
    throw `error duplicating containers: ${err}`;
  } finally {
    await setUrls(duplicated, urlsToSet, true, false);

    help(`Duplicated ${duplicated.length}/${containers.length} container${s}`);

    if (duplicated.length) {
      // when duplicating, the selected containers need to be deselected,
      // since the indices have changed
      await deselect();
    }
  }

  return duplicated.length;
};
