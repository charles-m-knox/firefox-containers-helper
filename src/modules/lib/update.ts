import { Container, ContainerUpdates } from '../../types';
import { updateContainer } from '../browser/containers';
import { help } from '../help';

/**
 * Updates one or more containers simultaneously.
 *
 * @param containers The containers to change
 * @param key The field to set for the containers
 * @param value The value to assign to the containers' `key` property
 */
export const update = async (containers: Container[], key: string, value: string) => {
  const updated: Container[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: ContainerUpdates | any = {};
  updates[key] = value;

  for (const container of containers) {
    try {
      const update = await updateContainer(container.cookieStoreId, updates);

      updated.push(update);

      help(`Updated ${updated.length} containers`);
    } catch (err) {
      throw `Failed to update container ${container.name} (id: ${container.cookieStoreId}): ${err}`;
    }
  }
};
