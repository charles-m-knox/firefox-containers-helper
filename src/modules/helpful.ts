import { getSetting } from './config';
import { ConfKey, Modes } from './constants';
import { helpfulStrings } from '../strings/strings';
import { help } from './help';

/**
 * Based on the currently selected mode, set a helpful message to show to the user.
 */
export const helpful = async (mode?: Modes) => {
  if (!mode) mode = (await getSetting<Modes>(ConfKey.mode)) || undefined; // TODO: fix this type awkwardness later
  switch (mode) {
    case Modes.SET_URL:
    case Modes.SET_NAME:
    case Modes.REPLACE_IN_URL:
    case Modes.REPLACE_IN_NAME:
    case Modes.SET_ICON:
    case Modes.SET_COLOR:
    case Modes.DUPLICATE:
    case Modes.DELETE:
    case Modes.REFRESH:
      help(helpfulStrings[mode]);
      break;
    default:
      help('');
      break;
  }
};
