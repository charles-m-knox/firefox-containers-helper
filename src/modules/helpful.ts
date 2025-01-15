import { getSetting } from './config';
import { CONF, MODES } from './constants';
import { helpfulStrings } from '../strings/strings';
import { help } from './help';

/**
 * Based on the currently selected mode, set a helpful message to show to the user.
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
