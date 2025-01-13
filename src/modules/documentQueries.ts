/** Throws if the element cannot be found. */
export const getElem = <T>(elementId: string): T => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw `The ${element} element could not be found.`;
  }

  return element as T;
};

export const getElemNullable = <T>(elementId: string): T | null => document.getElementById(elementId) as T | null;
