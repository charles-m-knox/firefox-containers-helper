import { Container, ExtensionConfig, SelectedContextIndex } from '../types';
import { getFakeContainer } from './testutil';
import { setSettings } from './config';
import { getActionable, selectionChanged } from './lib';

jest.mock('./config', () => ({
  setSettings: jest.fn().mockImplementation(() => {}),
}));

describe('selectionChanged', () => {
  interface Test {
    name: string;
    filtered: Container[];
    clicked: Container;
    selected: SelectedContextIndex;
    shiftModifier: boolean;
    prev: number;
    setSettingsArgs?: Partial<ExtensionConfig>;
    expected: SelectedContextIndex;
  }

  const fakeContainer1 = getFakeContainer({ cookieStoreId: 'unique01' });
  const fakeContainer2 = getFakeContainer({ cookieStoreId: 'unique02' });
  const fakeContainer3 = getFakeContainer({ cookieStoreId: 'unique03' });

  const tests: Test[] = [
    {
      name: 'updates the selection',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer3,
      selected: { 0: 0, 1: 0, 2: 0 },
      shiftModifier: false,
      prev: 0,
      setSettingsArgs: { lastSelectedContextIndex: 2 },
      expected: { 0: 0, 1: 0, 2: 1 },
    },
    {
      name: 'updates the selection, de-selecting the current container',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer1,
      selected: { 0: 1, 1: 0, 2: 0 },
      shiftModifier: false,
      prev: 2,
      setSettingsArgs: { lastSelectedContextIndex: 0 },
      expected: { 0: 0, 1: 0, 2: 0 },
    },
    {
      name: 'updates the selection, de-selecting the current container, which originally had an invalid selection value',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer1,
      selected: { 0: 100, 1: 0, 2: 0 },
      shiftModifier: false,
      prev: 2,
      setSettingsArgs: { lastSelectedContextIndex: 0 },
      expected: { 0: 1, 1: 0, 2: 0 },
    },
    {
      name: 'updates the selection in multi-select mode, selecting all containers',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer1,
      selected: { 0: 0, 1: 0, 2: 0 },
      shiftModifier: true,
      prev: 2,
      setSettingsArgs: { lastSelectedContextIndex: 0 },
      expected: { 0: 1, 1: 1, 2: 1 },
    },
    {
      name: 'updates the selection in multi-select mode, de-selecting some containers',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer3,
      selected: { 0: 1, 1: 1, 2: 1 },
      shiftModifier: true,
      prev: 0,
      setSettingsArgs: { lastSelectedContextIndex: 2 },
      expected: { 0: 0, 1: 0, 2: 0 },
    },
    {
      name: 'updates the selection in multi-select mode, de-selecting only the same container',
      filtered: [fakeContainer1, fakeContainer2, fakeContainer3],
      clicked: fakeContainer2,
      selected: { 0: 1, 1: 1, 2: 1 },
      shiftModifier: true,
      prev: 1,
      setSettingsArgs: { lastSelectedContextIndex: 1 },
      expected: { 0: 1, 1: 0, 2: 1 },
    },
  ];

  afterAll(() => {
    jest.resetAllMocks();
  });

  tests.forEach((test) =>
    it(test.name, async () => {
      const actual = await selectionChanged(test.filtered, test.clicked, test.selected, test.shiftModifier, test.prev);
      expect(actual).toStrictEqual(test.expected);
      expect(test.selected).toStrictEqual(test.expected);

      if (test.setSettingsArgs) {
        expect(setSettings).toHaveBeenCalledWith(test.setSettingsArgs);
      }
    }),
  );
});

describe('getActionable', () => {
  interface Test {
    name: string;
    filtered: Container[];
    clicked: Container;
    selected: SelectedContextIndex;
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
