import { helpTextMessages } from './constants';
import { getElemNullable } from './get';

/**
 * Sets a message inside the "warning" text element.
 * @param message The HTML string to put inside the warning text element.
 */
export const help = (message: string) => {
  let msg = message;
  if (!message) {
    // TODO: clean this up
    const rngHelpMsgIndex = parseInt((Math.random() * helpTextMessages.length).toString(), 10) || 0;
    msg = helpTextMessages[rngHelpMsgIndex];
  }

  const helpText = getElemNullable<HTMLSpanElement>('helpText');
  if (!helpText) return;

  helpText.innerText = msg;
};
