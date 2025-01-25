import { createContainer } from '../browser/containers';
import { getElemNullable } from '../get';
import { showAlert } from '../modals/modals';
import { deselect } from './deselect';
import { filter } from './filter';
import { help } from '../help';

/** Adds a new container. */
export const add = async () => {
  // make sure not to use config.lastQuery here, because it gets trimmed/ lowercased. This was a bug identified in GH
  // issue 37
  const searchInputEl = getElemNullable<HTMLInputElement>('searchContainerInput');
  if (!searchInputEl) {
    await showAlert('You must specify a container name in the input field.', 'No Name Provided');
    return;
  }

  const containerName = searchInputEl.value;
  if (!containerName) {
    await showAlert('An invalid new container name has been provided.', 'Invalid Name Provided');
    return;
  }

  // TODO: create helper function for this?
  const newContainer = {
    color: 'toolbar',
    icon: 'circle',
    name: containerName,
  };

  try {
    const created = await createContainer(newContainer);

    await filter();

    help(`Added a container named ${created.name}`);

    await deselect();
  } catch (err) {
    throw `Failed to create a container named ${containerName}: ${err}`;
  }
};
