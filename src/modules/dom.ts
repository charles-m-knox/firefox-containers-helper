import { CLASS_ELEMENT_HIDE, CLASS_ELEMENT_SHOW } from './classes';
import { getElemNullable } from './get';

export const hideElement = (el: HTMLElement | null) => {
  if (!el) return;
  el.classList.remove(CLASS_ELEMENT_SHOW);
  el.classList.add(CLASS_ELEMENT_HIDE);
};

export const showElement = (el: HTMLElement | null) => {
  if (!el) return;
  el.classList.add(CLASS_ELEMENT_SHOW);
  el.classList.remove(CLASS_ELEMENT_HIDE);
};

/**
 * `replaceElement` provides a quick way to remove all event listeners from e.g. a button. It clones the original
 * element and removes the original element and adds the newly cloned element to the original element's parent's
 * children. Note that the order of elements may not be fully preserved, so be careful.
 */
export const replaceElement = (el: HTMLElement | null): HTMLElement | null => {
  if (!el || !el.parentElement) return null;
  const nEl = el.cloneNode(true);
  el.parentElement.appendChild(nEl);
  el.parentElement.removeChild(el);
  return getElemNullable(el.id);
};
