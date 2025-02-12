import { Container, ContainerDefaultURL } from '../../types';
import { ConfKey } from '../constants';
import { showConfirm, showPrompt } from '../modals/modals';
import { help } from '../help';
import { getSetting, setSettings } from '../config';

/**
 * Associates a default URL to each container. Accepts either one string or a 1:1 mapping of containers to URL's - each
 * container will be assigned its corresponding URL by index.
 */
export const setUrls = async (containers: Container[], url: string[], allowAnyProtocol = false, updateHelp = true) => {
  if (!containers.length || !url.length) return;

  const multiple = containers.length > 1;
  const single = containers.length === 1;
  const oneUrl = url.length === 1;
  const sameLength = containers.length === url.length;

  if (multiple && !sameLength && !oneUrl) {
    throw `When setting URLs, either 1 URL must be passed in, or a 1:1 ratio of containers:URLs - got ${containers.length}:${url.length} instead`;
  }

  const first = url[0];

  const clear = oneUrl && first === 'none';
  const requireHTTP = !(await getSetting<boolean>(ConfKey.neverConfirmSaveNonHttpUrls));
  const noHTTPS = oneUrl && first.indexOf(`https://`) !== 0;
  const noHTTP = oneUrl && first.indexOf(`http://`) !== 0;
  const question =
    'Warning: URL\'s should start with "http://" or "https://". Firefox likely will not correctly open pages otherwise. If you would like to proceed, please confirm.\n\nThis dialog can be disabled in the extension preferences page.';
  const ask = !clear && !allowAnyProtocol && requireHTTP && noHTTPS && noHTTP;
  if (ask && !(await showConfirm(question, 'Allow Any Protocol?'))) return;

  const s = single ? '' : 's';
  const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
  let changed = false;

  try {
    let i = 0; // just for consistency
    for (const container of containers) {
      i++;
      const _url = oneUrl ? first : url[i];
      const _clear = _url === 'none';
      const m = `Updated URL for ${i}/${containers.length} container${s}`;

      if (_clear) {
        delete urls[container.cookieStoreId];
        changed = true;

        if (updateHelp) help(m);

        continue;
      }

      urls[container.cookieStoreId] = _url;
      changed = true;

      if (updateHelp) help(m);
    }
  } catch (e) {
    throw `setUrls threw error: ${e}`;
  } finally {
    if (changed) await setSettings({ containerDefaultUrls: urls });
  }
};

/**
 * Requests a default URL from the user, and assigns that URL to every given container.
 */
export const setUrlsPrompt = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';
  const question = `What should the default URL be for ${containers.length} container${s}?\n\nType "none" (without quotes) to clear the saved default URL value${s}.`;
  let prefill = '';
  if (one) {
    const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};
    const container = containers[0];
    const containerUrl = urls[container.cookieStoreId];
    if (urls[container.cookieStoreId]) {
      prefill = containerUrl;
    }
  }

  const url = await showPrompt(question, 'Provide URL', prefill);
  if (!url) return;

  await setUrls(containers, [url]);
};
