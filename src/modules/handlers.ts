import { SelectedContextIndex } from '../types';
import { getSetting } from './config';
import { CONF, PlatformModifierKey } from './constants';
import { reflectSelected } from './elements';
import { helpful } from './helpful';
import { toggleConfigFlag, filter, add, setMode, setSortMode, deselect } from './lib';
import { help } from './help';
import { getElem } from './get';

const stayOpenToggle = async (/* _: MouseEvent */) => {
  await toggleConfigFlag(CONF.windowStayOpenState);
};

const selectionModeToggle = async (/* _: MouseEvent */) => {
  await toggleConfigFlag(CONF.selectionMode);

  reflectSelected((await getSetting(CONF.selectedContextIndices)) as SelectedContextIndex);

  if (await getSetting(CONF.selectionMode)) {
    help(`${PlatformModifierKey}+Click to select 1; ${PlatformModifierKey}+Shift+Click for a range`);
    return;
  }

  await helpful();
};

const openCurrentPageToggle = async (/* _: MouseEvent */) => {
  await toggleConfigFlag(CONF.openCurrentPage);

  if (await getSetting(CONF.openCurrentPage)) {
    help(`Every container will open your current tab's URL.`);
  } else {
    await helpful();
  }

  await filter();
};

const addClick = async (/* _: MouseEvent */) => {
  await add();
};

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

const searchKeyUp = (event: KeyboardEvent) => {
  filter(event);
};

const searchSubmit = (submitEvent: SubmitEvent) => {
  submitEvent.preventDefault();
};

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
