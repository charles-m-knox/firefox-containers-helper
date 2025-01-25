import { HELP_MESSAGES } from './constants';
import { getElemNullable } from './get';
import { getRandomIndex } from './helpers/random';

/**
 * Sets a message inside the "warning" text element.
 *
 * @param message The HTML string to put inside the warning text element.
 */
export const help = (message: string) => {
  const helpText = getElemNullable<HTMLSpanElement>('helpText');
  if (!helpText) return;
  const msg = message || HELP_MESSAGES[getRandomIndex(HELP_MESSAGES.length)];
  helpText.innerText = msg;
};
