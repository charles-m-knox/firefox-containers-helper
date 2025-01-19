import { Modes } from '../modules/constants';

export const helpfulStrings: Record<string, string> = {};
helpfulStrings[Modes.SET_URL] = 'URLs are only set for this extension.';
helpfulStrings[Modes.SET_NAME] = 'You will be prompted for a new name.';
helpfulStrings[Modes.REPLACE_IN_URL] = 'You will be prompted for find & replace strings.';
helpfulStrings[Modes.REPLACE_IN_NAME] = 'You will be prompted for find & replace strings.';
helpfulStrings[Modes.SET_ICON] = 'You will be prompted for a new icon.';
helpfulStrings[Modes.SET_COLOR] = 'You will be prompted for a new color.';
helpfulStrings[Modes.DUPLICATE] = 'Duplicates containers, URLs; not cookies';
helpfulStrings[Modes.DELETE] = 'Warning: Will delete containers that you click';
helpfulStrings[Modes.REFRESH] = 'Warning: Will delete and recreate containers';
