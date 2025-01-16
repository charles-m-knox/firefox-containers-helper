import { Container, ContainerDefaultURL } from '../types';

export const getFakeContainer = (fields?: Partial<Container>): Container => {
  return {
    color: 'foo1',
    colorCode: 'bar1',
    cookieStoreId: 'uniqueId',
    icon: 'icon1',
    iconUrl: 'iconUrl1',
    name: 'some container',
    ...fields,
  };
};

export const getFakeContainerDefaultURLs = (fields?: Partial<ContainerDefaultURL>): ContainerDefaultURL => {
  return {
    uniqueId1: 'https://example.com',
    uniqueId2: 'https://example.com',
    uniqueId3: 'https://example.com',
    ...fields,
  };
};

export const getFakeBrowserTab = (fields?: Partial<browser.tabs.Tab>): browser.tabs.Tab => {
  return {
    active: false,
    highlighted: false,
    incognito: false,
    index: 0,
    pinned: false,
    id: browser.tabs.TAB_ID_NONE,
    ...fields,
  };
};
