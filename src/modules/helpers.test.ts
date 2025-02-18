import { getCurrentTabOverrideUrl, isAnyContainerSelected, objectEquals, queryUrls } from './helpers';
import { Container, ContainerDefaultURL, SelectedContainerIndex } from '../types';
import { getFakeContainer, getFakeContainerDefaultURLs } from './testutil';
import { UrlMatchType } from './constants';

// jest.mock('./help', () => ({
//   help: jest.fn().mockImplementation(() => {}),
// }));

describe('isAnyContainerSelected', () => {
  interface Test {
    name: string;
    selected: SelectedContainerIndex;
    expected: boolean;
  }

  const tests: Test[] = [
    {
      name: 'returns false if no context is selected',
      selected: { 0: 0, 1: 0, 2: 0 },
      expected: false,
    },
    {
      name: 'returns false if no contexts exist',
      selected: {},
      expected: false,
    },
    {
      name: 'returns true if with multiple selections are selected',
      selected: { 0: 1, 1: 0, 2: 0, 3: 0, 4: 1 },
      expected: true,
    },
    {
      name: 'returns true if a single selection is selected',
      selected: { 0: 1, 1: 0, 2: 0, 3: 0, 4: 0 },
      expected: true,
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = isAnyContainerSelected(test.selected);
      expect(actual).toBe(test.expected);
    }),
  );
});

describe('queryUrls', () => {
  interface Test {
    name: string;
    context: Container;
    query: string;
    urls: ContainerDefaultURL;
    expected: boolean;
  }

  const tests: Test[] = [
    {
      name: 'returns true if the queried string is present in the default url for the given container id',
      context: getFakeContainer({ cookieStoreId: 'foo100' }),
      query: 'foo.example.com',
      urls: getFakeContainerDefaultURLs({ foo100: 'https://foo.example.com' }),
      expected: true,
    },
    {
      name: 'returns false if the queried string is not present in the default url for the given container id',
      context: getFakeContainer({ cookieStoreId: 'foo100' }),
      query: 'foo.bar.com',
      urls: getFakeContainerDefaultURLs({ foo100: 'https://foo.example.com' }),
      expected: false,
    },
    {
      name: 'returns false if there is no default url saved for the current container',
      context: getFakeContainer({ cookieStoreId: 'foo109' }),
      query: 'foo.example.com',
      urls: getFakeContainerDefaultURLs({ foo110: 'https://foo.example.com' }),
      expected: false,
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = queryUrls(test.context, test.query, test.urls);
      expect(actual).toBe(test.expected);
    }),
  );
});

describe('getCurrentTabOverrideUrl', () => {
  interface Test {
    name: string;
    url: string;
    current: string;
    match: UrlMatchType;
    expected: string;
  }

  const tests: Test[] = [
    {
      name: 'should not override if url param is empty',
      url: '',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.origin,
      expected: '',
    },
    {
      name: 'should not override if current param is empty',
      url: 'https://foo.example.com/abc/def.html',
      current: '',
      match: UrlMatchType.origin,
      expected: '',
    },
    {
      name: 'should not override if origins differ',
      url: 'https://foo.example.com/abc/def.html',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.origin,
      expected: '',
    },
    {
      name: 'should not override if hosts differ',
      url: 'https://foo.example.com/abc/def.html',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.host,
      expected: '',
    },
    {
      name: 'should not override if domains differ',
      url: 'https://foo.example2.com/abc/def.html',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.domain,
      expected: '',
    },
    {
      name: 'should not override if domains and ports differ',
      url: 'https://foo.example2.com:3333/abc/def.html',
      current: 'https://bar.example.com:3333/foo',
      match: UrlMatchType.domainPort,
      expected: '',
    },
    {
      name: 'should not override if hostnames differ',
      url: 'https://foo.example.com/abc/def.html',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.hostname,
      expected: '',
    },
    {
      name: 'should override if domains match',
      url: 'https://foo.example.com/abc/def.html',
      current: 'https://bar.example.com/foo',
      match: UrlMatchType.domain,
      expected: 'https://bar.example.com/foo',
    },
    {
      name: 'should override if domains with non-standard and differing ports match',
      url: 'https://foo.example.com:4444/abc/def.html',
      current: 'https://bar.example.com:5555/foo',
      match: UrlMatchType.domain,
      expected: 'https://bar.example.com:5555/foo',
    },
    {
      name: 'should override if domains and ports match',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'https://bar.example.com:10001/foo',
      match: UrlMatchType.domainPort,
      expected: 'https://bar.example.com:10001/foo',
    },
    {
      name: 'should override if origins match',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'https://foo.example.com:10001/foo',
      match: UrlMatchType.origin,
      expected: 'https://foo.example.com:10001/foo',
    },
    {
      name: 'should override if hosts match, but protocol changes to http',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'http://foo.example.com:10001/foo',
      match: UrlMatchType.host,
      expected: 'http://foo.example.com:10001/foo',
    },
    {
      name: 'should override if hosts match, but protocol changes to gemini',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'gemini://foo.example.com:10001/foo',
      match: UrlMatchType.host,
      expected: 'gemini://foo.example.com:10001/foo',
    },
    {
      name: 'should override if hostnames match, but other things differ',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'gemini://foo.example.com:10002/foo',
      match: UrlMatchType.hostname,
      expected: 'gemini://foo.example.com:10002/foo',
    },
    {
      name: 'should not override if an empty match mode is used',
      url: 'https://foo.example.com:10001/abc/def.html',
      current: 'gemini://foo.example.com:10002/foo',
      match: UrlMatchType.empty,
      expected: '',
    },
    {
      name: 'should not override if an invalid url was provided',
      url: '%%%%%%%%',
      current: '!!!!!!!!',
      match: UrlMatchType.empty,
      expected: '',
    },
  ];

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = getCurrentTabOverrideUrl(test.url, test.current, test.match);
      expect(actual).toBe(test.expected);
    }),
  );
});

describe('objectEquals', () => {
  interface Test {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    x: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y: any;
    expected: boolean;
  }

  const sameFunc = () => true;
  const sameRegex = /^someRegex$/;

  const tests: Test[] = [
    {
      name: 'returns true if two equal objects are passed',
      x: {
        0: 0,
        1: 0,
        2: 0,
        foo: undefined,
        foo1: null,
        foo2: sameFunc,
        foo3: sameRegex,
      },
      y: {
        0: 0,
        1: 0,
        2: 0,
        foo: undefined,
        foo1: null,
        foo2: sameFunc,
        foo3: sameRegex,
      },
      expected: true,
    },
    {
      name: 'returns false when array lengths differ',
      x: { foo: [] },
      y: { foo: ['bar'] },
      expected: false,
    },
    {
      name: 'returns false when dates differ',
      x: { foo: new Date(100) },
      y: { foo: new Date(0) },
      expected: false,
    },
    {
      name: 'returns false when receiving differing constructors',
      x: { constructor: [undefined] },
      y: { constructor: [null] },
      expected: false,
    },
    {
      name: 'returns false when receiving non-object instanceOf results (x)',
      x: { foo: 5 },
      y: { foo: 6 },
      expected: false,
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, () => {
      const actual = objectEquals(test.x, test.y);
      expect(actual).toBe(test.expected);
    }),
  );
});
