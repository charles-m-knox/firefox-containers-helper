import { Container } from '../types';
import {
  CLASSES_CONTAINER_DIV,
  CLASSES_CONTAINER_ICON,
  CLASSES_CONTAINER_ICON_DIV,
  CLASSES_CONTAINER_ICON_EMPTY_TEXT,
  CLASSES_CONTAINER_LI_EMPTY,
} from './classes';
import { CONTAINER_LIST_GROUP_ID } from './constants';
import {
  buildContainerIcon,
  buildContainerListGroupElement,
  buildContainerListItemEmpty,
  buildEmptyContainerLabelElement,
} from './elements';
import { getFakeContainer } from './testutil';

describe('buildEmptyContainerLabelElement', () => {
  interface Test {
    name: string;
    label: string;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'builds an empty container label element',
      label: 'foo',
      expected: `<div class="${CLASSES_CONTAINER_DIV}"><span>foo</span></div>`,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = buildEmptyContainerLabelElement(test.label);
      expect(actual.outerHTML).toBe(test.expected);
    }),
  );
});

describe('buildContainerListItemEmpty', () => {
  interface Test {
    name: string;
    i: number;
    expected: () => string;
  }

  const tests: Test[] = [
    {
      name: 'builds an empty container label element',
      i: 50,
      expected: () => {
        const label = buildEmptyContainerLabelElement('No results');
        label.id = `filtered-context-50-label`;
        return `<li class="${CLASSES_CONTAINER_LI_EMPTY}" id="filtered-context-50-li"><span class="${CLASSES_CONTAINER_ICON_EMPTY_TEXT}">x</span>${label.outerHTML}</li>`;
      },
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = buildContainerListItemEmpty(test.i);
      expect(actual.outerHTML).toBe(test.expected());
    }),
  );
});

describe('buildContainerIcon', () => {
  interface Test {
    name: string;
    container: Container;
    expected: string;
  }

  const fakeContainer1 = getFakeContainer({
    cookieStoreId: 'unique01',
    iconUrl: 'https://example.com/icon',
    colorCode: '#000000',
  });

  const tests: Test[] = [
    {
      name: 'builds an empty container label element',
      container: fakeContainer1,
      expected: `<div class="${CLASSES_CONTAINER_ICON_DIV}"><i style="webkit-mask-size: cover; mask-size: cover; webkit-mask-image: url(${fakeContainer1.iconUrl}); mask-image: url(${fakeContainer1.iconUrl}); background-color: rgb(0, 0, 0); width: 16px; height: 16px; display: inline-block;" class="${CLASSES_CONTAINER_ICON}"></i></div>`,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = buildContainerIcon(test.container);
      expect(actual.outerHTML).toBe(test.expected);
    }),
  );
});

describe('buildContainerListGroupElement', () => {
  interface Test {
    name: string;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'builds an empty container label element',
      expected: `<ul id="${CONTAINER_LIST_GROUP_ID}" class="list-group"></ul>`,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = buildContainerListGroupElement();
      expect(actual.outerHTML).toBe(test.expected);
    }),
  );
});
