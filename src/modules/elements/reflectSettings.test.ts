import { ExtensionConfig } from '../../types';
import { getSettings } from '../config/getSettings';
import { reflectSettings } from '../elements';
import { Mode, UrlMatchTypes } from '../constants';
import { getElem } from '../get';

jest.mock('../config/getSettings', () => ({
  getSettings: jest.fn().mockImplementation(
    (): Promise<ExtensionConfig> =>
      Promise.resolve({
        windowStayOpenState: true,
        selectionMode: true,
        sort: 'fooSort',
        alwaysGetSync: true,
        alwaysSetSync: true,
        containerDefaultUrls: {},
        selectedContextIndices: {},
        lastQuery: 'last-query',
        lastSelectedContextIndex: -1,
        mode: Mode.OPEN,
        neverConfirmOpenNonHttpUrls: true,
        neverConfirmSaveNonHttpUrls: true,
        openCurrentPage: true,
        openCurrentTabUrlOnMatch: UrlMatchTypes.origin,
      }),
  ),
}));

describe('reflectSettings', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects settings', async () => {
    document.body.innerHTML = `<div>
<select id="modeSelect"><option value="1" selected>1</option><option value="openOnClick">2</option></select>
<select id="sortModeSelect"><option value="3" selected>3</option><option value="fooSort">4</option></select>
<input type="checkbox" id="windowStayOpenState" value="off"></input>
<input type="checkbox" id="selectionMode" value="off"></input>
<input type="checkbox" id="openCurrentPage" value="off"></input>
<input id="searchContainerInput" value="6"></input>
</div>`;

    expect(getElem<HTMLSelectElement>('modeSelect').value).toBe('1');
    expect(getElem<HTMLSelectElement>('sortModeSelect').value).toBe('3');
    expect(getElem<HTMLInputElement>('windowStayOpenState').checked).toBe(false);
    expect(getElem<HTMLInputElement>('selectionMode').checked).toBe(false);
    expect(getElem<HTMLInputElement>('openCurrentPage').checked).toBe(false);
    expect(getElem<HTMLInputElement>('searchContainerInput').value).toBe('6');

    await reflectSettings();

    expect(getSettings).toHaveBeenCalledTimes(1);

    expect(getElem<HTMLSelectElement>('modeSelect').value).toBe(Mode.OPEN);
    expect(getElem<HTMLSelectElement>('sortModeSelect').value).toBe('fooSort');
    expect(getElem<HTMLInputElement>('windowStayOpenState').checked).toBe(true);
    expect(getElem<HTMLInputElement>('selectionMode').checked).toBe(true);
    expect(getElem<HTMLInputElement>('openCurrentPage').checked).toBe(true);
    expect(getElem<HTMLInputElement>('searchContainerInput').value).toBe('last-query');
  });
});
