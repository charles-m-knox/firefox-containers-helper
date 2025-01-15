import { CLASS_ELEMENT_HIDE, CLASS_ELEMENT_SHOW } from './classes';
import { hideElement, replaceElement, showElement } from './dom';
import { getElem } from './get';

describe('hideElement', () => {
  interface Test {
    name: string;
    el: () => HTMLElement | null;
    isNull: boolean;
  }

  const tests: Test[] = [
    {
      name: 'hides a shown div element',
      el: () => {
        const div = document.createElement('div');
        div.className = CLASS_ELEMENT_SHOW;
        return div;
      },
      isNull: false,
    },
    {
      name: 'hides a hidden div element',
      el: () => {
        const div = document.createElement('div');
        div.className = CLASS_ELEMENT_HIDE;
        return div;
      },
      isNull: false,
    },
    {
      name: 'is a no-op when null is provided',
      el: () => null,
      isNull: true,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const el = test.el();
      hideElement(el);
      if (test.isNull) return;
      if (!el) throw 'element should not be null';
      expect(el.className.includes(CLASS_ELEMENT_SHOW)).toBe(false);
      expect(el.className.includes(CLASS_ELEMENT_HIDE)).toBe(true);
    }),
  );
});

describe('showElement', () => {
  interface Test {
    name: string;
    el: () => HTMLElement | null;
    isNull: boolean;
  }

  const tests: Test[] = [
    {
      name: 'shows a shown div element',
      el: () => {
        const div = document.createElement('div');
        div.className = CLASS_ELEMENT_SHOW;
        return div;
      },
      isNull: false,
    },
    {
      name: 'shows a hidden div element',
      el: () => {
        const div = document.createElement('div');
        div.className = CLASS_ELEMENT_HIDE;
        return div;
      },
      isNull: false,
    },
    {
      name: 'is a no-op when null is provided',
      el: () => null,
      isNull: true,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const el = test.el();
      showElement(el);
      if (test.isNull && !el) return;
      if (!el) throw 'element should not be null';
      expect(el.className.includes(CLASS_ELEMENT_SHOW)).toBe(true);
      expect(el.className.includes(CLASS_ELEMENT_HIDE)).toBe(false);
    }),
  );
});

describe('replaceElement', () => {
  interface Test {
    name: string;
    el: () => [HTMLElement | null, HTMLElement | null];
    innerHTML: string;
    isNull: boolean;
  }

  const tests: Test[] = [
    {
      name: 'replaces a span child element',
      innerHTML: `<div id="someAncestor"><div id="divFoo"><span id="bar">foo</span></div></div>`,
      el: () => {
        return [getElem<HTMLDivElement>('divFoo'), getElem<HTMLSpanElement>('bar')] as const;
      },
      isNull: false,
    },
    {
      name: 'is a no-op when parent null is provided',
      innerHTML: `<div id="foo"></div>`,
      el: () => {
        return [null, document.createElement('div')] as const;
      },
      isNull: true,
    },
    {
      name: 'is a no-op when child null is provided',
      innerHTML: `<div id="foo"></div>`,
      el: () => {
        return [document.createElement('div'), null] as const;
      },
      isNull: true,
    },
  ];

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  tests.forEach((test) =>
    it(test.name, () => {
      document.body.innerHTML = test.innerHTML;

      const [parent, child] = test.el();
      const actual = replaceElement(child);

      if (test.isNull && (parent === null || child === null)) return;
      if (parent === null || child === null) throw 'parent or child should not be null';
      if (actual === null) throw 'actual is null';

      expect(actual.id).toBe(child.id);
      expect(actual.parentElement?.id).toBe(parent.id);
    }),
  );
});
