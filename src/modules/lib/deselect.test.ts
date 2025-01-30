import { setSettings } from '../config';
import { deselect } from './deselect';

jest.mock('../config', () => ({
  setSettings: jest.fn().mockImplementation(async () => {}),
}));

describe('deselect', () => {
  it('deselects', async () => {
    await deselect();

    expect(setSettings).toHaveBeenCalledTimes(1);
    expect(setSettings).toHaveBeenCalledWith({
      selectedContextIndices: {},
      lastSelectedContextIndex: 0,
    });
  });
});
