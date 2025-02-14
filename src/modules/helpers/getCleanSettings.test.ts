import { Container, ExtensionConfig } from '../../types';
import { getContainer } from '../browser/containers';
import { getCleanSettings } from '../helpers';
import { getFakeContainer, getFakeExtensionConfig } from '../testutil';

jest.mock('../browser/containers', () => ({
  getContainer: jest.fn().mockImplementation(async (fields) => getFakeContainer(fields)),
}));

describe('getCleanSettings', () => {
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
    expected: [ExtensionConfig, string[]];
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
        async () => {
          throw 'simulated failure';
        },
      ],
      expected: [
        getFakeExtensionConfig({
          containerDefaultUrls: {
            container01: 'https://example.com/1',
            container02: 'https://example.com/2',
            container03: 'https://example.com/3',
          },
          selectedContextIndices: {},
        }),
        ['container04', 'container05', 'container06'],
      ],
    },
  ];

  tests.forEach((test) => {
    it(test.name, async () => {
      test.mockedContainers.forEach((container) => {
        (getContainer as jest.Mock).mockImplementationOnce(container);
      });

      const actual = await getCleanSettings(test.conf);
      expect(actual).toStrictEqual(test.expected);
    });
  });
});
