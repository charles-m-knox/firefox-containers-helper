import { Container, SelectedContainerIndex } from '../../types';
import { getFakeContainer } from '../testutil';
import { getActionable } from './getActionable';

describe('getActionable', () => {
  interface Test {
    name: string;
    filtered: Container[];
    clicked: Container;
    selected: SelectedContainerIndex;
    shiftModifier: boolean;
    expected: Container[];
  }

  const fakeContainer1 = getFakeContainer({ cookieStoreId: 'unique01' });
  const fakeContainer2 = getFakeContainer({ cookieStoreId: 'unique02' });
  const fakeContainer3 = getFakeContainer({ cookieStoreId: 'unique03' });

  const tests: Test[] = [
    {
      name: 'determines that a few containers are selected and actionable',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer3,
      selected: { 0: 0, 1: 1, 2: 1 },
      shiftModifier: false,
      expected: [fakeContainer2, fakeContainer3],
    },
    {
      name: 'determines that a no containers are selected, but shift key should act on them all',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer3,
      selected: { 0: 0, 1: 0, 2: 0 },
      shiftModifier: true,
      expected: [fakeContainer1, fakeContainer2, fakeContainer3],
    },
    {
      name: 'determines that a no containers are selected, no shift key, and a single container was clicked',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer3,
      selected: { 0: 0, 1: 0, 2: 0 },
      shiftModifier: false,
      expected: [fakeContainer3],
    },
    {
      name: 'determines that a no containers are selected, no shift key, and no container was clicked, so the first result is actionable',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: undefined as unknown as Container, // TODO: improve the underlying type definition for the function instead of this
      selected: { 0: 0, 1: 0, 2: 0 },
      shiftModifier: false,
      expected: [fakeContainer1],
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, async () => {
      const actual = getActionable(test.filtered, test.clicked, test.selected, test.shiftModifier);
      expect(actual).toStrictEqual(test.expected);
    }),
  );
});
