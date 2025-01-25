import { Container, SelectedContainerIndex, ExtensionConfig } from '../../types';
import { setSettings } from '../config';
import { getFakeContainer } from '../testutil';
import { selectionChanged } from './selectionChanged';

jest.mock('../config', () => ({
  setSettings: jest.fn().mockImplementation(() => {}),
}));

describe('selectionChanged', () => {
  interface Test {
    name: string;
    filtered: Container[];
    clicked: Container;
    selected: SelectedContainerIndex;
    shiftModifier: boolean;
    prev: number;
    setSettingsArgs?: Partial<ExtensionConfig>;
    expected: SelectedContainerIndex;
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
