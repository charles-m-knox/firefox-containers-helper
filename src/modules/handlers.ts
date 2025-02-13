import { ExtensionConfig, SelectedContainerIndex } from '../types';
import { getSetting, setSettings } from './config';
import { ConfKey, Modes, PlatformModifierKey, SortModes } from './constants';
import { reflectSelected, reflectSettings } from './elements';
import { helpful } from './helpful';
import { deselect } from './lib/deselect';
import { filter } from './lib/filter';
import { add } from './lib/add';
import { help } from './help';
import { getElem } from './get';
import { showAlert } from './modals/modals';
import { alertOnError } from './helpers';

/**
 * When a user checks a checkbox, this function toggles that value in the `config` object, as well as setting all of the
 * other mutually exclusive options to `false`. It will also update the UI checkboxes to reflect the values.
 *
 * @param key The `ExtensionConfig` key to toggle.
 */
const toggleConfigFlag = async (key: ConfKey) => {
  const original = await getSetting<boolean>(key);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: any = {};

  updates[key] = !original;

  await setSettings(updates as Partial<ExtensionConfig>);
  await reflectSettings();
};

/**
 * When the user changes the current mode, this function sets the stored
 * configuration value accordingly.
 * @param mode The mode to set.
 */
const setMode = async (mode: string | Modes) => {
  switch (mode) {
    case Modes.OPEN:
    case Modes.SET_URL:
    case Modes.SET_NAME:
    case Modes.SET_COLOR:
    case Modes.SET_ICON:
    case Modes.REPLACE_IN_NAME:
    case Modes.REPLACE_IN_URL:
    case Modes.DUPLICATE:
    case Modes.DELETE:
    case Modes.REFRESH:
      await setSettings({ mode });
      break;
    default:
      await showAlert(`Invalid mode '${mode}'.`, 'Invalid Mode');
      return;
  }
  await reflectSettings();
  await helpful();
};

/**
 * When the user changes the current sort mode, this function sets the stored configuration value accordingly.
 *
 * @param mode The mode to set.
 */
const setSortMode = async (mode: string | SortModes) => {
  switch (mode) {
    case SortModes.NameAsc:
    case SortModes.NameDesc:
    case SortModes.None:
    case SortModes.NoneReverse:
    case SortModes.UrlAsc:
    case SortModes.UrlDesc:
      await setSettings({ sort: mode });
      break;
    default:
      await showAlert(`Invalid sort mode '${mode}'.`, 'Invalid Sort Mode');
      break;
  }

  await reflectSettings();
};

const stayOpenToggle = async (/* _: MouseEvent */) => await toggleConfigFlag(ConfKey.windowStayOpenState);

const selectionModeToggle = async (/* _: MouseEvent */) => {
  await toggleConfigFlag(ConfKey.selectionMode);
  reflectSelected((await getSetting<SelectedContainerIndex>(ConfKey.selectedContextIndices)) || {});
  if (await getSetting<boolean>(ConfKey.selectionMode)) {
    help(`${PlatformModifierKey}+Click to select 1; ${PlatformModifierKey}+Shift+Click for a range`);
    return;
  }

  await helpful();
};

const openCurrentPageToggle = async (/* _: MouseEvent */) => {
  await toggleConfigFlag(ConfKey.openCurrentPage);

  if (await getSetting<boolean>(ConfKey.openCurrentPage)) {
    help(`Every container will open your current tab's URL.`);
  } else {
    await helpful();
  }

  await filter();
};

const addClick = async (/* _: MouseEvent */) =>
  alertOnError(async () => await add())('Failed to create a new container', 'Failed to Add Container');

const modeChange = async (event: Event) => {
  if (!event.target) return;
  const target = event.target as HTMLSelectElement;
  await setMode(target.value);
  event.preventDefault();
};

const sortChange = async (event: Event) => {
  if (!event.target) return;
  const target = event.target as HTMLSelectElement;
  await setSortMode(target.value);
  await deselect();
  await filter();
  event.preventDefault();
};

const searchKeyUp = (event: KeyboardEvent) => filter(event);
const searchSubmit = (submitEvent: SubmitEvent) => submitEvent.preventDefault();

/** Sets HTML event handlers for all interactive components. */
export const setHandlers = () => {
  // prevents the Search button from causing page navigation/popup flashes
  getElem<HTMLFormElement>('searchContainerForm').addEventListener('submit', searchSubmit);
  getElem<HTMLInputElement>('searchContainerInput').addEventListener('keyup', searchKeyUp);
  getElem<HTMLInputElement>('windowStayOpenState').addEventListener('click', stayOpenToggle);
  getElem<HTMLInputElement>('selectionMode').addEventListener('click', selectionModeToggle);
  getElem<HTMLInputElement>('openCurrentPage').addEventListener('click', openCurrentPageToggle);
  getElem<HTMLInputElement>('addNewContainer').addEventListener('click', addClick);
  getElem<HTMLSelectElement>('modeSelect').addEventListener('change', modeChange);
  getElem<HTMLSelectElement>('sortModeSelect').addEventListener('change', sortChange);
};
