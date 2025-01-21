import { SelectedContainerIndex } from '../../types';
import { reflectSelected } from '../elements';
import { getElemNullable } from '../get';
import {
  CLASSES_CONTAINER_LI_INACTIVE,
  CLASSES_CONTAINER_LI_SELECTED,
  CLASSES_CONTAINER_LI_URL_LABEL,
  CLASSES_CONTAINER_LI_URL_LABEL_INVERTED,
} from '../classes';

describe('reflectSelected', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects selected', async () => {
    document.body.innerHTML = `<div>
<li id="filtered-context-0-li"><span id="filtered-context-0-url-label"></span></li>
<li id="filtered-context-1-li"><span id="filtered-context-1-url-label"></span></li>
<li id="filtered-context-2-li"><span id="filtered-context-2-url-label"></span></li>
<li id="filtered-context-3-li"><span id="filtered-context-3-url-label"></span></li>
<li id="filtered-context-4-li"><span id="filtered-context-4-url-label"></span></li>
</div>`;

    const selected: SelectedContainerIndex = {
      0: 1,
      1: 1,
      2: 0,
      3: 1,
      4: 1,
    };

    const keys = Object.keys(selected);
    for (let i = 0; i < keys.length; i++) {
      const li = getElemNullable<HTMLLIElement>(`filtered-context-${i}-li`);
      const urlLabel = getElemNullable<HTMLSpanElement>(`filtered-context-${i}-url-label`);
      expect(li?.className).toBe('');
      expect(urlLabel?.className).toBe('');
    }

    reflectSelected(selected);

    for (let i = 0; i < keys.length; i++) {
      const li = getElemNullable<HTMLLIElement>(`filtered-context-${i}-li`);
      const urlLabel = getElemNullable<HTMLSpanElement>(`filtered-context-${i}-url-label`);
      expect(li?.className).toBe(selected[i] === 1 ? CLASSES_CONTAINER_LI_SELECTED : CLASSES_CONTAINER_LI_INACTIVE);
      expect(urlLabel?.className).toBe(
        selected[i] === 1 ? CLASSES_CONTAINER_LI_URL_LABEL_INVERTED : CLASSES_CONTAINER_LI_URL_LABEL,
      );
    }
  });
});
