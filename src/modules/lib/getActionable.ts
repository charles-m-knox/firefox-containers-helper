import { Container, SelectedContainerIndex } from '../../types';
import { isAnyContainerSelected } from '../helpers';

/** Determines the actionable containers based on the user's current selection or filtered view. */
export const getActionable = (
  filtered: Container[],
  clicked: Container,
  selected: SelectedContainerIndex,
  shiftModifier: boolean,
) => {
  const containers: Container[] = [];
  if (isAnyContainerSelected(selected)) {
    const keys = Object.keys(selected);
    for (let i = 0; i < keys.length; i++) {
      if (selected[i] === 1) {
        containers.push(filtered[i]);
      }
    }
  } else {
    // determine how many containers to modify
    if (shiftModifier) {
      containers.push(...filtered);
    } else {
      if (clicked) {
        containers.push(clicked);
      } else {
        containers.push(filtered[0]);
      }
    }
  }

  return containers;
};
