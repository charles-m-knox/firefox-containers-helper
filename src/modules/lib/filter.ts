import { Container, ContainerDefaultURL, SelectedContainerIndex } from '../../types';
import { queryContainers } from '../browser/containers';
import { getSetting } from '../config/getSetting';
import { setSettings } from '../config/setSettings';
import {
  CONTAINER_LIST_DIV_ID,
  CONTAINER_LIST_GROUP_ID,
  ConfKey,
  Mode,
  SORT_MODE_NAME_ASC,
  SORT_MODE_NAME_DESC,
  SORT_MODE_NONE,
  SORT_MODE_NONE_REVERSE,
  SORT_MODE_URL_ASC,
  SORT_MODE_URL_DESC,
  SortMode,
} from '../constants';
import {
  buildContainerListGroupElement,
  buildContainerListItem,
  buildContainerListItemEmpty,
  reflectSelected,
} from '../elements';
import { getElem, getElemNullable } from '../get';
import { alertOnError, queryUrls } from '../helpers';
import { actHandler } from '../lib';
import { getActiveTab } from '../browser/tabs';
import { deselect } from './deselect';

/**
 * Retrieves the search query from the user via the search text input. The latest query will always be pushed to the
 * extension settings so that it can be recalled the next time the user opens up the popup. Additionally, the user's
 * current container selection will be reset if the query has changed from its previous value.
 */
const getQuery = async () => {
  const query = getElemNullable<HTMLInputElement>('searchContainerInput')?.value?.trim()?.toLowerCase() || '';
  if (query !== (await getSetting<string>(ConfKey.lastQuery))) {
    // the query has changed, so reset any items the user has selected
    await deselect();
  }
  await setSettings({ lastQuery: query });
  return query;
};

const applyQuery = async (containers: Container[], queryLower: string) => {
  const results: Container[] = [];

  // first, apply filtering directly:
  const urls = (await getSetting<ContainerDefaultURL>(ConfKey.containerDefaultUrls)) || {};

  for (const container of containers) {
    const nameLower = container.name.toLowerCase();
    const nameMatch = nameLower.indexOf(queryLower) !== -1;
    const urlMatch = queryUrls(container, queryLower, urls);
    const emptyQuery = !queryLower;
    if (!emptyQuery && !nameMatch && !urlMatch) continue;
    results.push(container);
  }

  // second, sort according to the user-configured sort:
  const sort = await getSetting<SortMode>(ConfKey.sort);

  results.sort((a: Container, b: Container) => {
    const urlA: string = (urls[a.cookieStoreId] || '').toLowerCase();
    const urlB: string = (urls[b.cookieStoreId] || '').toLowerCase();
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    switch (sort) {
      case SORT_MODE_NAME_ASC:
        return nameA.localeCompare(nameB);
      case SORT_MODE_NAME_DESC:
        return nameB.localeCompare(nameA);
      case SORT_MODE_URL_ASC:
        return urlA.localeCompare(urlB);
      case SORT_MODE_URL_DESC:
        return urlB.localeCompare(urlA);
      case SORT_MODE_NONE:
      default:
        return 0;
    }
  });

  if (sort === SORT_MODE_NONE_REVERSE) results.reverse();
  return results;
};

/**
 * Manipulates the popup UI/HTML to show the passed-in set of filtered results.
 */
const reflectFiltered = async (results: Container[], actualTabUrl?: string | null) => {
  // finally, propagate the sorted results to the UI:
  const tab = await getActiveTab();
  const mode = await getSetting<Mode>(ConfKey.mode);
  const containerList = getElem<HTMLDivElement>(CONTAINER_LIST_DIV_ID);

  // prepare by clearing out the old query's HTML output
  const list = getElemNullable<HTMLUListElement>(CONTAINER_LIST_GROUP_ID);
  if (list) containerList.removeChild(list);

  // now build its successor
  const ul = buildContainerListGroupElement();

  results.map(async (container, i) =>
    ul.appendChild(await buildContainerListItem(results, container, i, tab, actualTabUrl || '', mode, actHandler)),
  );

  if (results.length === 0) {
    const li = buildContainerListItemEmpty(0);
    ul.append(li);
  }

  containerList.appendChild(ul);
};

/**
 * Applies the user's search query, and updates the list of containers accordingly.
 *
 * @param event The event that called this function, such as a key press or mouse click
 * @param actualTabUrl When in sticky popup mode, when opening a new URL, the new tab page might not be loaded yet, so
 * the tab query returns an empty URL. actualTabUrl allows a URL to be passed in in advance, so that the extension can
 * properly show URL overrides in the UI.
 */
export const filter = async (event?: Event | KeyboardEvent | MouseEvent | null, actualTabUrl?: string | null) =>
  alertOnError(async () => {
    if (event) event.preventDefault();
    const query = await getQuery();
    const queryLower = query.toLowerCase();
    const containers = await queryContainers({});

    if (!Array.isArray(containers)) {
      reflectSelected((await getSetting<SelectedContainerIndex>(ConfKey.selectedContextIndices)) || {});
      return;
    }

    // in order to enable sorting, we have to do multiple
    // passes at the containers array.
    const results = await applyQuery(containers, queryLower);
    await reflectFiltered(results, actualTabUrl);

    const bottomHelpText = getElemNullable<HTMLSpanElement>('summaryText');
    if (bottomHelpText) {
      bottomHelpText.innerText = `${results.length}/${containers.length} shown`;
    }

    if (event) {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter' && results.length > 0) {
        await actHandler(results, results[0], keyboardEvent);
      }

      event.preventDefault();
    }

    reflectSelected((await getSetting<SelectedContainerIndex>(ConfKey.selectedContextIndices)) || {});
  })('Failed to filter the list of containers', 'Filter Error');
