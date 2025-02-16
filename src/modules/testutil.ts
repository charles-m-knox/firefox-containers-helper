import { Container, ContainerDefaultURL, ExtensionConfig } from '../types';
import { Mode, SortModes, UrlMatchTypes } from './constants';

export const getFakeContainer = (fields?: Partial<Container>): Container => ({
  color: 'foo1',
  colorCode: 'bar1',
  cookieStoreId: 'uniqueId',
  icon: 'icon1',
  iconUrl: 'iconUrl1',
  name: 'some container',
  ...fields,
});

export const getFakeContainerDefaultURLs = (fields?: Partial<ContainerDefaultURL>): ContainerDefaultURL => ({
  uniqueId1: 'https://example.com',
  uniqueId2: 'https://example.com',
  uniqueId3: 'https://example.com',
  ...fields,
});

// export const getFakeBrowserTab = (fields?: Partial<Tab>): Tab => ({
//   active: false,
//   highlighted: false,
//   incognito: false,
//   index: 0,
//   pinned: false,
//   id: browser.tabs.TAB_ID_NONE,
//   ...fields,
// });

export const getFakeExtensionConfig = (fields?: Partial<ExtensionConfig>): ExtensionConfig => ({
  alwaysGetSync: false,
  alwaysSetSync: false,
  containerDefaultUrls: {},
  lastQuery: 'foo',
  lastSelectedContextIndex: -1,
  mode: Mode.OPEN,
  neverConfirmOpenNonHttpUrls: false,
  neverConfirmSaveNonHttpUrls: false,
  openCurrentPage: false,
  openCurrentTabUrlOnMatch: UrlMatchTypes.domainPort,
  selectedContextIndices: {},
  selectionMode: false,
  sort: SortModes.None,
  windowStayOpenState: true,
  ...fields,
});
