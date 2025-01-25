import { Container, Tab, ContainerDefaultURL } from '../../types';
import { getSetting } from '../config';
import { ConfKey, UrlMatchTypes } from '../constants';
import { showConfirm } from '../modals/modals';
import { getCurrentTabOverrideUrl } from '../helpers';

/**
 * Opens multiple container tabs according to controllable conditions.
 *
 * @param containers The array of containers that will each open as a container tab.
 * @param pinned Whether or not to open as a pinned tab.
 * @param tab The currently active tab. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
 */
export const open = async (containers: Container[], pinned: boolean, tab: Tab) => {
  const question = `Are you sure you want to open ${containers.length} container tabs?`;
  const isMany = containers.length >= 10;
  if (isMany && !(await showConfirm(question, 'Open Many?'))) return;
  if (containers.length === 0) return;
  let shouldPrompt = true;

  const requireHTTP = !(await getSetting(ConfKey.neverConfirmOpenNonHttpUrls));
  const useCurrentTabUrl = (await getSetting(ConfKey.openCurrentTabUrlOnMatch)) as UrlMatchTypes;
  const openCurrentPage = (await getSetting(ConfKey.openCurrentPage)) as boolean;
  const urls = (await getSetting(ConfKey.containerDefaultUrls)) as ContainerDefaultURL;

  for (const container of containers) {
    let url = urls[container.cookieStoreId] || '';

    // requested in GH issue 29
    if (useCurrentTabUrl && tab?.url) {
      const overrideUrl = getCurrentTabOverrideUrl(url, tab.url, useCurrentTabUrl);
      if (overrideUrl) {
        url = overrideUrl;
      }
    }

    // requested in GH issue 31
    if (tab.url && openCurrentPage) {
      url = tab.url;
    }

    // don't even bother querying tabs if the "tab url matching"
    // configuration option isn't set
    const newTab: Partial<Tab> = {
      cookieStoreId: container.cookieStoreId,
      pinned: pinned,
    };

    try {
      const empty = url === '';
      const noHTTPS = url.indexOf(`https://`) !== 0;
      const noHTTP = url.indexOf(`http://`) !== 0;

      if (shouldPrompt && !empty && requireHTTP && noHTTPS && noHTTP) {
        const q = `Warning: The URL "${url}" does not start with "http://" or "https://". This may cause undesirable behavior. Proceed to open a tab with this URL?\n\nThis dialog can be disabled in the extension preferences page.`;
        if (!(await showConfirm(q, 'Allow Any Protocol?'))) return;
        // only need to prompt the user once
        shouldPrompt = false;
      }

      if (!empty) {
        newTab.url = url;
      }

      await browser.tabs.create(newTab);
    } catch (err) {
      throw `Failed to open container '${container.name}' (id ${container.cookieStoreId}) with URL ${url}: ${err}`;
    }
  }
};
