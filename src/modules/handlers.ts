import { ExtensionConfig, SelectedContainerIndex } from '../types';
import { getSetting } from './config/getSetting';
import { setSettings } from './config/setSettings';
import { ConfKey, Mode, PlatformModifierKey, SortMode } from './constants';
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
const setMode = async (mode: string | Mode) => {
  switch (mode) {
    case Mode.OPEN:
    case Mode.SET_URL:
    case Mode.SET_NAME:
    case Mode.SET_COLOR:
    case Mode.SET_ICON:
    case Mode.REPLACE_IN_NAME:
    case Mode.REPLACE_IN_URL:
    case Mode.DUPLICATE:
    case Mode.DELETE:
    case Mode.REFRESH:
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
const setSortMode = async (mode: string | SortMode) => {
  switch (mode) {
    case SortMode.NameAsc:
    case SortMode.NameDesc:
    case SortMode.None:
    case SortMode.NoneReverse:
    case SortMode.UrlAsc:
    case SortMode.UrlDesc:
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
