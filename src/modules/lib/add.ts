import { createContainer } from '../browser/containers';
import { getElemNullable } from '../get';
import { showAlert } from '../modals/modals';
import { deselect } from './deselect';
import { filter } from './filter';
import { help } from '../help';

/** Adds a new container. The name of the container is retrieved from an input field in the popup UI. */
export const add = async () => {
  // make sure not to use config.lastQuery here, because it gets trimmed/lowercased. This was a bug identified in GH
  // issue 37
  const containerName = getElemNullable<HTMLInputElement>('searchContainerInput')?.value;
  if (!containerName) {
    await showAlert('You must specify a valid container name in the input field.', 'Invalid Name Provided');
    return;
  }

  const created = await createContainer({
    color: 'toolbar',
    icon: 'circle',
    name: containerName,
  });

  await filter();
  help(`Added a container named ${created.name}`);
  await deselect();
};
