import { Container, ContainerDefaultURL, SelectedContainerIndex, Tab } from '../types';
import { getSetting } from './config/getSetting';
import { setSettings } from './config/setSettings';
import { ConfKey, Modes, UrlMatchTypes } from './constants';
import { reflectSelected } from './elements';
import { getModifiers } from './events/modifiers';
import { preventUnload, relieveUnload } from './events';
import { alertOnError, getCurrentTabOverrideUrl } from './helpers';
import { showConfirm } from './modals/modals';
import { getActiveTab } from './browser/tabs';
import { deselect } from './lib/deselect';
import { filter } from './lib/filter';
import { getActionable } from './lib/getActionable';
import { replaceInUrls } from './lib/replaceInUrls';
import { open } from './lib/open';
import { selectionChanged } from './lib/selectionChanged';
import { rename } from './lib/rename';
import { del } from './lib/delete';
import { refresh } from './lib/refresh';
import { setUrlsPrompt } from './lib/setUrls';
import { setColors } from './lib/setColors';
import { setIcons } from './lib/setIcons';
import { replaceInName } from './lib/replaceInName';
import { duplicate } from './lib/duplicate';

/**
 * Actions to perform when an action is completed.
 *
 * @param currentUrl Optional, determines what URL should be considered as "active" when filtering containers
 */
const done = async (currentUrl: string) => {
  const stay = await getSetting<boolean>(ConfKey.windowStayOpenState);

  relieveUnload();

  // decide to close the extension or not at the last step
  if (!stay) {
    window.close();
    return;
  }

  await filter(null, currentUrl);
};

/**
 * `getActionableUrl` exists because in sticky popup mode, the current tab URL changes to blank at first, and `filter()`
 * will not show the URL overrides. So, we have to look at the last container in the array and force `filter()` to treat
 * that URL as the active tab URL.
 *
 * @return The URL to act on.
 */
const getActionableUrl = async (containers: Container[], tab: Tab) => {
  let url = '';
  if (!containers.length) return '';

  // validate that each container has a cookie store ID
  for (const container of containers) {
    if (container?.cookieStoreId) continue;

    throw `A container you attempted to open has an invalid configuration: ${JSON.stringify(container)}`;
  }

  const last = containers[containers.length - 1];

  const urls = await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls);
  const openCurrentTabUrlOnMatch = await getSetting<UrlMatchTypes>(ConfKey.openCurrentTabUrlOnMatch);

  // the last container opened will be used as the last URL; this will be passed into the actionCompletedHandler. I had
  // to choose something to put here, and the last URL makes the most sense.
  if (urls) url = urls[last.cookieStoreId];

  // TODO: this is refactorable logic copy/pasted from open()
  if (openCurrentTabUrlOnMatch && tab.url) {
    const overriddenUrlToOpen = getCurrentTabOverrideUrl(url, tab.url, openCurrentTabUrlOnMatch);

    if (overriddenUrlToOpen) {
      url = overriddenUrlToOpen;
    }
  }

  // override the URL if the user has elected to open the current page
  // for all filtered tabs
  const openCurrentPage = await getSetting<boolean>(ConfKey.openCurrentPage);

  if (openCurrentPage && tab.url) return tab.url;

  return url;
};

/**
 * Delete, rename, set URL, open, refresh, etc - the action is triggered here.
 *
 * The primary decision tree for determine what action to perform when a user clicks a selection of containers or hits
 * the enter key for their filtered search.
 */
const act = async (containers: Container[], ctrl: boolean) => {
  const tab = await getActiveTab();

  let navigatedUrl = '';

  const mode = await getSetting<Modes>(ConfKey.mode);

  preventUnload();

  switch (mode) {
    case Modes.SET_NAME:
      await rename(containers);
      break;
    case Modes.DELETE: {
      const deleted = await del(containers);
      if (deleted > 0) await deselect();
      break;
    }
    case Modes.REFRESH: {
      const [removed, refreshed] = await refresh(containers);
      if (removed > 0 || refreshed > 0) await deselect();
      break;
    }
    case Modes.SET_URL:
      await setUrlsPrompt(containers);
      break;
    case Modes.SET_COLOR:
      await setColors(containers);
      break;
    case Modes.SET_ICON:
      await setIcons(containers);
      break;
    case Modes.REPLACE_IN_NAME:
      await replaceInName(containers);
      break;
    case Modes.REPLACE_IN_URL:
      await replaceInUrls(containers);
      break;
    case Modes.DUPLICATE: {
      const duplicated = await duplicate(containers);
      if (duplicated > 0) await deselect();
      break;
    }
    case Modes.OPEN:
      navigatedUrl = await getActionableUrl(containers, tab);
      await open(containers, ctrl, tab);
      break;
    default:
      break;
  }

  await done(navigatedUrl);
};

/**
 * Adds click and other event handlers to a container list item HTML element.
 *
 * @param filtered A list of the currently filtered set of containers
 * @param clicked The container associated with this handler, assume that a user clicked on a specific container to open
 * if this is defined
 * @param event The event that called this function, such as a key press or mouse click
 */
export const actHandler = async (filtered: Container[], clicked: Container, event: MouseEvent | KeyboardEvent) =>
  alertOnError(async () => {
    const [ctrl, shift] = getModifiers(event);
    const selectionMode = await getSetting<boolean>(ConfKey.selectionMode);
    const selected = (await getSetting<SelectedContainerIndex>(ConfKey.selectedContextIndices)) || {};
    if (selectionMode && ctrl) {
      const prev = (await getSetting<number>(ConfKey.lastSelectedContextIndex)) || 0;
      const updatedSelection = await selectionChanged(filtered, clicked, selected, shift, prev);
      await setSettings({ selectedContextIndices: updatedSelection });
      reflectSelected(updatedSelection);
      return;
    }

    const containers = getActionable(filtered, clicked, selected, shift);
    if (containers.length > 50) {
      // estimate of 100 container actions / second, but cut that in half to be safe
      const estimateLow = Math.ceil(containers.length / 100);
      const estimateHigh = Math.ceil(containers.length / 50);
      const proceed = await showConfirm(
        `Warning: You're about to perform an action on a large number of containers (${containers.length}). This action might take around ${estimateLow}-${estimateHigh} seconds (or much longer), depending on your system. If you close the extension popup window, the action may get interrupted before completing. Alternatively, you can click 'Open in Tab' below and execute the operation in a dedicated tab. Do you want to proceed?`,
        `Long Operation`,
      );

      if (!proceed) return;
    }

    await act(containers, ctrl);
  })('Failed to act on one or more containers', 'Error');
