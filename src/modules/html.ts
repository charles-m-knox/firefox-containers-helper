import { getSetting } from './config';
import { CONF, MODES } from './constants';
import { getElemNullable } from './documentQueries';
import { helpfulStrings } from '../strings/strings';
import { help } from './help';

/**
 * Sets a message inside the "summary" text element, such as "Showing x/y containers"
 * @param message The HTML string to put inside the summary text element.
 */
export const bottomHelp = (message: string) => {
  const summary = getElemNullable<HTMLSpanElement>('summaryText');
  if (!summary) return;
  summary.innerText = message;
};

/**
 * Based on the currently selected mode, set a helpful message to show
 * to the user.
 */
export const helpful = async (mode?: MODES) => {
  if (!mode) mode = (await getSetting(CONF.mode)) as MODES;

  switch (mode) {
    case MODES.SET_URL:
    case MODES.SET_NAME:
    case MODES.REPLACE_IN_URL:
    case MODES.REPLACE_IN_NAME:
    case MODES.SET_ICON:
    case MODES.SET_COLOR:
    case MODES.DUPLICATE:
    case MODES.DELETE:
    case MODES.REFRESH:
      help(helpfulStrings[mode]);
      break;
    default:
      help('');
      break;
  }
};
