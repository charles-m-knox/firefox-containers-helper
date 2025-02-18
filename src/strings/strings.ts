import { Mode } from '../modules/constants';

export const helpfulStrings: Record<string, string> = {};
helpfulStrings[Mode.SET_URL] = 'URLs are only set for this extension.';
helpfulStrings[Mode.SET_NAME] = 'You will be prompted for a new name.';
helpfulStrings[Mode.REPLACE_IN_URL] = 'You will be prompted for find & replace strings.';
helpfulStrings[Mode.REPLACE_IN_NAME] = 'You will be prompted for find & replace strings.';
helpfulStrings[Mode.SET_ICON] = 'You will be prompted for a new icon.';
helpfulStrings[Mode.SET_COLOR] = 'You will be prompted for a new color.';
helpfulStrings[Mode.DUPLICATE] = 'Duplicates containers, URLs; not cookies';
helpfulStrings[Mode.DELETE] = 'Warning: Will delete containers that you click';
helpfulStrings[Mode.REFRESH] = 'Warning: Will delete and recreate containers';
