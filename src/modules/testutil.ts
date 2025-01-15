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
