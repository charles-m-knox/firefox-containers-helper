import { ActHandler, Container, ContainerDefaultURL, SelectedContainerIndex, Tab } from '../types';
import {
  CLASSES_CONTAINER_LI_SELECTED,
  CLASSES_CONTAINER_LI_INACTIVE,
  CLASSES_CONTAINER_DIV,
  CLASSES_CONTAINER_LI,
  CLASSES_CONTAINER_DIV_DESTRUCTIVE,
  CLASSES_CONTAINER_LI_EMPTY,
  CLASSES_CONTAINER_ICON_DIV,
  CLASSES_CONTAINER_LI_URL_LABEL_INVERTED,
  CLASSES_CONTAINER_LI_URL_LABEL,
  CLASSES_CONTAINER_ICON_EMPTY_TEXT,
  CLASSES_CONTAINER_ICON,
} from './classes';
import { Modes, ConfKey, UrlMatchTypes, CONTAINER_LIST_GROUP_ID } from './constants';
import { getCurrentTabOverrideUrl } from './helpers';
import { addEmptyEventListeners, setEventListeners } from './events';
import { getSetting, getSettings } from './config';
import { getElem } from './get';

/**
 * As part of rebuilding the filtered list of containers, this function assembles a list group element.
 *
 * @returns The `<ul>` list group element that will hold the child `<li>` container list items.
 */
export const buildContainerListGroupElement = () => {
  const ul = document.createElement('ul');
  ul.id = CONTAINER_LIST_GROUP_ID;
  ul.className = 'list-group';
  return ul;
};

/**
 * Assembles an HTML element that contains the colorized container icon for a given container. context - The container
 * that this icon element will represent
 *
 * @returns An HTML element containing the colorized container icon for `context`.
 */
export const buildContainerIcon = (context: Container) => {
  const iconDiv = document.createElement('div');
  iconDiv.className = CLASSES_CONTAINER_ICON_DIV;

  const icon = document.createElement('i');
  icon.style.webkitMaskSize = 'cover';
  icon.style.maskSize = 'cover';
  icon.style.webkitMaskImage = `url(${context.iconUrl})`;
  icon.style.maskImage = `url(${context.iconUrl})`;
  icon.style.backgroundColor = context.colorCode;
  icon.style.width = '16px';
  icon.style.height = '16px';
  icon.style.display = 'inline-block';
  icon.className = CLASSES_CONTAINER_ICON;

  addEmptyEventListeners([iconDiv, icon]);

  iconDiv.appendChild(icon);

  return iconDiv;
};

/**
 * Assembles an HTML element that contains a text label for a given container.
 *
 * @param context - The container that this text element will represent
 * @param i The index of this container within the `filteredResults` array
 * @param currentTab The currently active tab. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
 * @param actualCurrentUrl The URL that the current tab is supposed to be loading.
 * @returns An HTML element containing text that represents the
 * container's name and default URL, if defined.
 */
export const buildContainerLabel = async (
  context: Container,
  i: number,
  currentTab: Tab,
  actualCurrentUrl: string,
): Promise<HTMLDivElement> => {
  try {
    const containerDiv = document.createElement('div') as HTMLDivElement;
    containerDiv.className = CLASSES_CONTAINER_DIV;

    const nameLabel = document.createElement('span') as HTMLSpanElement;
    nameLabel.innerText = `${context.name}`;

    const urlLabel = document.createElement('span') as HTMLSpanElement;
    urlLabel.className = CLASSES_CONTAINER_LI_URL_LABEL;
    urlLabel.id = `filtered-context-${i}-url-label`;

    const urls = (await getSetting(ConfKey.containerDefaultUrls)) as ContainerDefaultURL;

    const url = urls[context.cookieStoreId];

    if (url) {
      const urlMatchType = (await getSetting(ConfKey.openCurrentTabUrlOnMatch)) as UrlMatchTypes;

      if (urlMatchType && (currentTab || actualCurrentUrl)) {
        // if the current tab isn't loaded yet, the url might be empty,
        // but we are supposed to be navigating to a page
        let currentUrl = currentTab.url || '';
        if (actualCurrentUrl) {
          currentUrl = actualCurrentUrl;
        }

        const overrideUrl = getCurrentTabOverrideUrl(url, currentUrl, urlMatchType);
        if (overrideUrl && overrideUrl !== url) {
          urlLabel.innerHTML = `<s>${url.substring(
            0,
            40,
          )}</s><br/>${urlMatchType} match, will open in this URL:<br/>${overrideUrl.substring(0, 40)}`;
        } else {
          urlLabel.innerText = `${url.substring(0, 40)}`;
        }
      } else {
        urlLabel.innerText = `${url.substring(0, 40)}`;
      }
    } else {
      // maybe use this instead if it's ever needed - it just looks
      // off-center though.
      // urlLabel.innerHTML = '&nbsp;'
      urlLabel.innerText = '-';
      urlLabel.title = 'Opens in a blank container tab. Set a default URL to change this.';
    }

    const openCurrentPage = (await getSetting(ConfKey.openCurrentPage)) as boolean;

    // similar to the above - if the "openCurrentPage" config option has been selected,
    // then we should override all URL's, as a finality

    if (openCurrentPage && (currentTab || actualCurrentUrl)) {
      // TODO: bit of refactoring would be nice since I just copy/pasted
      // this from above

      // if the current tab isn't loaded yet, the url might be empty,
      // but we are supposed to be navigating to a page
      let currentUrl = currentTab.url || '';
      if (actualCurrentUrl) {
        currentUrl = actualCurrentUrl;
      }

      urlLabel.innerHTML = `${currentUrl.substring(0, 40)}${currentUrl.length > 40 ? '...' : ''}`;
    }

    addEmptyEventListeners([nameLabel, urlLabel, containerDiv]);

    containerDiv.appendChild(nameLabel);
    containerDiv.appendChild(urlLabel);

    return containerDiv;
  } catch (err) {
    throw `failed to build container label element: ${err}`;
  }
};

/**
 * Assembles an HTML element that contains a text label for empty search results.
 *
 * @returns An HTML element containing text that represents the container's name and default URL, if defined.
 */
export const buildEmptyContainerLabelElement = (label: string) => {
  const div = document.createElement('div');
  div.className = CLASSES_CONTAINER_DIV;
  const containerLabelElement = document.createElement('span');
  containerLabelElement.innerHTML = `${label}`;
  addEmptyEventListeners([containerLabelElement, div]);
  div.appendChild(containerLabelElement);
  return div;
};

/**
 * Assembles an HTML element that contains an entire container list item.
 *
 * @param filteredResults A list of the currently filtered set of containers
 * @param context The contextualIdentity that this list item will represent
 * @param i The index of this contextualIdentity within the filteredResults array
 * @param currentTab The currently active tab. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/Tab
 * @param actualCurrentUrl The URL that the current tab is supposed to be loading.
 * @returns An HTML element with event listeners, formatted with css as a bootstrap list item.
 */
export const buildContainerListItem = async (
  filteredResults: Container[],
  context: Container,
  i: number,
  currentTab: Tab,
  actualCurrentUrl: string,
  mode: Modes,
  actHandler: ActHandler,
): Promise<HTMLLIElement> => {
  try {
    const li = document.createElement('li') as HTMLLIElement;
    li.className = CLASSES_CONTAINER_LI;

    const icon = buildContainerIcon(context);
    const label = await buildContainerLabel(context, i, currentTab, actualCurrentUrl);

    if (mode === Modes.DELETE || mode === Modes.REFRESH) {
      const div = document.createElement('div') as HTMLDivElement;

      div.className = CLASSES_CONTAINER_DIV_DESTRUCTIVE;
      div.id = `filtered-context-${i}-div`;

      addEmptyEventListeners([div]);

      div.appendChild(icon);
      li.appendChild(div);
    } else {
      li.appendChild(icon);
    }

    li.appendChild(label);

    icon.id = `filtered-context-${i}-icon`;
    label.id = `filtered-context-${i}-label`;
    li.id = `filtered-context-${i}-li`;

    await setEventListeners(li, filteredResults, context, i, actHandler);

    return li;
  } catch (e) {
    throw `encountered error building list item for container ${context.name}: ${e}`;
  }
};

/**
 * Assembles an HTML element that represents empty search results, but appears
 * similar to an actual search result.
 * @param i A unique value that will make the class/id of the element unique
 * @returns An HTML element with event listeners, formatted with css as a bootstrap list item.
 */
export const buildContainerListItemEmpty = (i: number) => {
  const li = document.createElement('li');
  li.className = CLASSES_CONTAINER_LI_EMPTY;

  const label = buildEmptyContainerLabelElement('No results');

  const icon = document.createElement('span');
  icon.className = CLASSES_CONTAINER_ICON_EMPTY_TEXT;
  icon.innerHTML = 'x';

  li.appendChild(icon);
  li.appendChild(label);

  label.id = `filtered-context-${i}-label`;
  li.id = `filtered-context-${i}-li`;

  return li;
};

/**
 * Sets the proper class names for filtered contexts that are either selected or not
 */
export const reflectSelected = (selected: SelectedContainerIndex) => {
  const keys = Object.keys(selected);
  for (let i = 0; i < keys.length; i++) {
    const li = document.getElementById(`filtered-context-${i}-li`) as HTMLLIElement;
    const urlLabel = document.getElementById(`filtered-context-${i}-url-label`) as HTMLSpanElement;
    if (selected[i] === 1) {
      if (li) {
        li.className = CLASSES_CONTAINER_LI_SELECTED;
      }
      if (urlLabel) {
        urlLabel.className = CLASSES_CONTAINER_LI_URL_LABEL_INVERTED;
      }
    } else {
      if (li) {
        li.className = CLASSES_CONTAINER_LI_INACTIVE;
      }
      if (urlLabel) {
        urlLabel.className = CLASSES_CONTAINER_LI_URL_LABEL;
      }
    }
  }
};

/**
 * Retrieves extension settings from browser storage and reflects their values in UI elements.
 */
export const reflectSettings = async () => {
  const settings = await getSettings();
  for (const key in settings) {
    switch (key) {
      case ConfKey.mode:
        getElem<HTMLSelectElement>('modeSelect').value = settings[key] as string;
        break;
      case ConfKey.sort:
        getElem<HTMLSelectElement>('sortModeSelect').value = settings[key] as string;
        break;
      case ConfKey.windowStayOpenState:
        getElem<HTMLInputElement>('windowStayOpenState').checked = settings[key] as boolean;
        break;
      case ConfKey.selectionMode:
        getElem<HTMLInputElement>('selectionMode').checked = settings[key] as boolean;
        break;
      case ConfKey.openCurrentPage:
        getElem<HTMLInputElement>('openCurrentPage').checked = settings[key] as boolean;
        break;
      case ConfKey.lastQuery:
        getElem<HTMLInputElement>('searchContainerInput').value = settings[key] as string;
        break;
      case ConfKey.containerDefaultUrls: // no UI elements for this currently
      default:
        break;
    }
  }
};
