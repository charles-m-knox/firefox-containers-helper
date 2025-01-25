import { Container, SelectedContainerIndex } from '../../types';
import { setSettings } from '../config';

/**
 * Updates the selected containers index based on user input and state. This function modifies the `selected` object,
 * and also returns it for convenience.
 *
 * @param filtered The entire list of filtered containers
 * @param clicked The currently clicked container, should be present in the `filtered` array
 * @param selected The index of selected containers
 * @param shiftModifier
 * @param prev The previously clicked container index
 */
export const selectionChanged = async (
  filtered: Container[],
  clicked: Container,
  selected: SelectedContainerIndex,
  shiftModifier: boolean,
  prev: number,
) => {
  // determine the index of the container that was selected
  for (let i = 0; i < filtered.length; i++) {
    // initialize the the list of indices if there isn't a value there
    if (selected[i] !== 1 && selected[i] !== 0) {
      selected[i] = 0;
    }

    // take note of the currently selected index
    if (filtered[i].cookieStoreId === clicked.cookieStoreId) {
      await setSettings({ lastSelectedContextIndex: i });

      // toggle the currently selected index unless the shift key is pressed
      if (!shiftModifier) {
        if (selected[i] === 1) {
          selected[i] = 0;
        } else {
          selected[i] = 1;
        }
      } else {
        // if shift+ctrl is pressed, then invert the current
        // selection, and then also set the rest of the
        // range from the last click to the same value
        let newVal = 0;
        if (selected[i] === 1) {
          newVal = 0;
        } else {
          newVal = 1;
        }
        if (prev < i) {
          for (let j = prev; j <= i; j++) {
            selected[j] = newVal;
          }
        } else if (prev > i) {
          for (let j = prev; j >= i; j--) {
            selected[j] = newVal;
          }
        } else {
          selected[i] = newVal;
        }
      }
    }
  }

  return selected;
};
