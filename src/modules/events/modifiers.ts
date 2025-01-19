/**
 * Determines if `ctrl` and if `shift` are individually pressed.
 *
 * @returns Two booleans in order: `ctrlModifier` and `shiftModifier`.
 */
export const getModifiers = (event?: MouseEvent | KeyboardEvent): [boolean, boolean] =>
  event
    ? [event.getModifierState('Control') || event.getModifierState('Meta'), event.getModifierState('Shift')]
    : [false, false];
