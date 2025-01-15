import { getElem, getElemNullable } from './get';

describe('getElem and getElemNullable', () => {
  interface Test {
    name: string;
    elementId: string;
    isPresent: boolean;
    innerHTML: string;
    expected?: () => HTMLElement;
  }

  const tests: Test[] = [
    {
      name: 'gets a div element by id',
      elementId: 'foo',
      isPresent: true,
      innerHTML: `<div id="foo"></div>`,
      expected: () => {
        const div = document.createElement('div');
        div.setAttribute('id', 'foo');
        document.body.appendChild(div);
        return div;
      },
    },
    {
      name: 'gets a span element by id',
      elementId: 'foo',
      isPresent: true,
      innerHTML: `<span id="foo"></span>`,
      expected: () => {
        const span = document.createElement('span');
        span.setAttribute('id', 'foo');
        document.body.appendChild(span);
        return span;
      },
    },
    {
      name: 'fails to get a div element by id',
      elementId: 'foo',
      isPresent: false,
      innerHTML: `<div id="bar"></div>`,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, () => {
      document.body.innerHTML = test.innerHTML;
      if (test.isPresent && test.expected) {
        const actual = getElem<HTMLElement>(test.elementId);
        expect(actual.outerHTML).toBe(test.expected().outerHTML);

        const actualNullable = getElemNullable<HTMLElement>(test.elementId);

        if (!actualNullable) {
          throw 'expected a non-null element';
        }
        expect(actualNullable.outerHTML).toBe(test.expected().outerHTML);
      } else {
        try {
          expect(() => getElem(test.elementId)).toThrow();
        } catch (err) {
          expect(err).toBeTruthy();
        }

        try {
          const actualNullable = getElemNullable<HTMLElement | null>(test.elementId);
          expect(actualNullable).toBe(null);
        } catch (err) {
          throw `getElemNullable without element present should not have thrown: ${err}`;
        }
      }
    }),
  );
});
