import { Container, ContainerDefaultURL, ExtensionConfig } from '../../types';
import { getContainer } from '../browser/containers';
import { getFakeContainer, getFakeExtensionConfig } from '../testutil';
import { checkDirty } from './checkDirty';

jest.mock('../browser/containers', () => ({
  getContainer: jest.fn().mockImplementation(async (fields) => getFakeContainer(fields)),
}));

describe('checkDirty', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  interface TestCase {
    name: string;
    conf: ExtensionConfig;
    mockedContainers: (() => Promise<Container>)[];
    expected: number;
  }

  const tests: TestCase[] = [
    {
      name: 'finds a few orphaned container urls',
      conf: getFakeExtensionConfig({
        containerDefaultUrls: {
          container01: 'https://example.com/1',
          container02: 'https://example.com/2',
          container03: 'https://example.com/3',
          container04: 'https://example.com/4',
          container05: 'https://example.com/5',
          container06: 'https://example.com/6',
        },
      }),
      mockedContainers: [
        async () => getFakeContainer({ cookieStoreId: 'container01' }),
        async () => getFakeContainer({ cookieStoreId: 'container02' }),
        async () => getFakeContainer({ cookieStoreId: 'container03' }),
        async () => getFakeContainer({ cookieStoreId: 'container04' }),
      ],
      expected: 2,
    },
    {
      name: 'handles a falsy container',
      conf: getFakeExtensionConfig({
        containerDefaultUrls: {
          container01: 'https://example.com/1',
          container02: 'https://example.com/2',
          container03: 'https://example.com/3',
        },
      }),
      mockedContainers: [
        async () => getFakeContainer({ cookieStoreId: 'container01' }),
        async () => getFakeContainer({ cookieStoreId: 'container02' }),
        async () => undefined as unknown as Container,
      ],
      expected: 1,
    },
    {
      name: 'handles a falsy containerDefaultUrls setting',
      conf: getFakeExtensionConfig({
        containerDefaultUrls: undefined as unknown as ContainerDefaultURL,
      }),
      mockedContainers: [],
      expected: 0,
    },
    {
      name: 'handles an exception when retrieving a container',
      conf: getFakeExtensionConfig({
        containerDefaultUrls: {
          container01: 'https://example.com/1',
        },
      }),
      mockedContainers: [
        async () => {
          throw 'test exception';
        },
      ],
      expected: 1,
    },
  ];

  tests.forEach((test) => {
    it(test.name, async () => {
      test.mockedContainers.forEach((container) => {
        (getContainer as jest.Mock).mockImplementationOnce(container);
      });

      const actual = await checkDirty(test.conf);
      expect(actual).toBe(test.expected);
    });
  });
});
