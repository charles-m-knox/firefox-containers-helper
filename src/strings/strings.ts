import { MODES } from '../modules/constants';

export const helpfulStrings: Record<string, string> = {};
helpfulStrings[MODES.SET_URL] = 'URLs are only set for this extension.';
helpfulStrings[MODES.SET_NAME] = 'You will be prompted for a new name.';
helpfulStrings[MODES.REPLACE_IN_URL] = 'You will be prompted for find & replace strings.';
helpfulStrings[MODES.REPLACE_IN_NAME] = 'You will be prompted for find & replace strings.';
helpfulStrings[MODES.SET_ICON] = 'You will be prompted for a new icon.';
helpfulStrings[MODES.SET_COLOR] = 'You will be prompted for a new color.';
helpfulStrings[MODES.DUPLICATE] = 'Duplicates containers, URLs; not cookies';
helpfulStrings[MODES.DELETE] = 'Warning: Will delete containers that you click';
helpfulStrings[MODES.REFRESH] = 'Warning: Will delete and recreate containers';
