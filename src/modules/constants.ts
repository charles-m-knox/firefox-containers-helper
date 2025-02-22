import { getPlatformModifierKey } from './navigator/platform';

export const PlatformModifierKey = getPlatformModifierKey();

/**
 * Used for the primary keyboard shortcut that triggers the popup window for the extension.
 *
 * @see https://github.com/mdn/webextensions-examples/blob/60ce50b10ee66f6d706b0715909e756e4bdba63d/commands/options.js
 * @see https://github.com/mdn/webextensions-examples/blob/60ce50b10ee66f6d706b0715909e756e4bdba63d/commands/options.html
 */
export const COMMAND_NAME = '_execute_browser_action';

/**
 * All allowable container (context) icons.
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/ContextualIdentity#icon
 */
export const CONTEXT_ICONS = [
  'fingerprint',
  'briefcase',
  'dollar',
  'cart',
  'circle',
  'gift',
  'vacation',
  'food',
  'fruit',
  'pet',
  'tree',
  'chill',
  'fence',
];

/**
 * All allowable container (context) colors.
 *
 * @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/contextualIdentities/ContextualIdentity#color
 */
export const CONTEXT_COLORS = ['blue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'pink', 'purple', 'toolbar'];

/** All functional modes that allow the user to interact with containers. */
export enum Mode {
  OPEN = 'openOnClick',
  SET_URL = 'setDefaultUrlsOnClick',
  SET_NAME = 'renameOnClick',
  SET_COLOR = 'setColorOnClick',
  SET_ICON = 'setIconOnClick',
  REPLACE_IN_NAME = 'replaceInNameOnClick',
  REPLACE_IN_URL = 'replaceInUrlOnClick',
  DUPLICATE = 'duplicateOnClick',
  DELETE = 'deleteContainersOnClick',
  REFRESH = 'refreshOnClick',
}

/** All keys for the `ExtensionConfiguration` interface. */
export enum ConfKey {
  windowStayOpenState = 'windowStayOpenState',
  selectionMode = 'selectionMode',
  sort = 'sort',
  openCurrentPage = 'openCurrentPage',
  mode = 'mode',
  lastQuery = 'lastQuery',
  containerDefaultUrls = 'containerDefaultUrls',
  selectedContextIndices = 'selectedContextIndices',
  lastSelectedContextIndex = 'lastSelectedContextIndex',
  alwaysGetSync = 'alwaysGetSync',
  alwaysSetSync = 'alwaysSetSync',
  neverConfirmOpenNonHttpUrls = 'neverConfirmOpenNonHttpUrls',
  neverConfirmSaveNonHttpUrls = 'neverConfirmSaveNonHttpUrls',
  openCurrentTabUrlOnMatch = 'openCurrentTabUrlOnMatch',
}

/** Random list of help messages to show in the Help Text area. */
export const HELP_MESSAGES = [
  'Tip: Press Enter or click on a container below.',
  `Tip: Use ${PlatformModifierKey}(+Shift) to open pinned tabs.`,
  'Tip: Shift+Click operates on every result.',
  'Tip: Visit Preferences for bulk import/export.',
];

export const SORT_MODE_NAME_ASC = 'name-a';
export const SORT_MODE_NAME_DESC = 'name-d';
export const SORT_MODE_URL_ASC = 'url-a';
export const SORT_MODE_URL_DESC = 'url-d';
export const SORT_MODE_NONE = 'none';
export const SORT_MODE_NONE_REVERSE = 'none-r';

export enum SortMode {
  NameAsc = 'name-a',
  NameDesc = 'name-d',
  None = 'url-a',
  NoneReverse = 'url-d',
  UrlAsc = 'none',
  UrlDesc = 'none-r',
}

export enum UrlMatchType {
  origin = 'origin',
  host = 'host',
  domain = 'domain',
  domainPort = 'domain-port',
  hostname = 'hostname',
  empty = '',
}

/** The `<div>` ID of the container list. This is where all of the queried containers will go. */
export const CONTAINER_LIST_DIV_ID = 'container-list';

/** The ID of the container list <ul> element. */
export const CONTAINER_LIST_GROUP_ID = 'containerListGroup';

/** Firefox Sync vs local storage. */
export enum SettingsTypes {
  Local = 'local',
  Sync = 'sync',
}
