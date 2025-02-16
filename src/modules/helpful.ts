import { getSetting } from './config/getSetting';
import { ConfKey, Mode } from './constants';
import { helpfulStrings } from '../strings/strings';
import { help } from './help';

/**
 * Based on the currently selected mode, `helpful` shows a helpful message to the user.
 */
export const helpful = async (mode?: Mode | null) => {
  if (!mode) mode = await getSetting<Mode>(ConfKey.mode);
  switch (mode) {
    case Mode.SET_URL:
    case Mode.SET_NAME:
    case Mode.REPLACE_IN_URL:
    case Mode.REPLACE_IN_NAME:
    case Mode.SET_ICON:
    case Mode.SET_COLOR:
    case Mode.DUPLICATE:
    case Mode.DELETE:
    case Mode.REFRESH:
      help(helpfulStrings[mode]);
      break;
    default:
      help('');
      break;
  }
};
