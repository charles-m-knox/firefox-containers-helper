import { bulkExport } from '../preferences';
import { ExtensionConfig } from '../../types';
import { getSyncSettings, getLocalSettings, setSyncSettings } from '../config';
import { COMMAND_NAME } from '../constants';
import { getElemNullable, getElem } from '../get';
import { objectEquals } from '../helpers';
import { showAlert } from '../modals/modals';
import { browserCommandsGetAll } from '../browser/commands';

/** Reflects the saved value for the keyboard shortcut to show the popup. */
export const reflectKeyboardShortcut = async () => {
  const shortcut = getElemNullable<HTMLInputElement>('shortcut');
  if (!shortcut) {
    await showAlert('Error: Element with ID shortcut is not present.', 'HTML Error');
    return;
  }

  const commands = await browserCommandsGetAll();
  for (const command of commands) {
    if (command.name === COMMAND_NAME && command.shortcut) {
      shortcut.value = command.shortcut;
      return;
    }
  }

  await showAlert('Warning: A keyboard shortcut may not be set correctly.', 'Keyboard Shortcut');
};

/**
 * Sets the validation text.
 *
 * @param color Bootstrap color class
 */
export const setValidationText = (msg: string, color: string) => {
  if (!msg || !color) return;

  const syncValidationText = getElem<HTMLSpanElement>('syncValidationText');
  const className = `badge badge-${color} mt-4`;

  syncValidationText.innerText = msg;
  syncValidationText.className = className;
};

export const setSaveSettingsButtonsDisabled = async (disabled: boolean) => {
  const btnSaveLocal = getElem<HTMLButtonElement>('btnSaveLocal');
  const btnSaveSync = getElem<HTMLButtonElement>('btnSaveSync');
  btnSaveLocal.disabled = disabled;
  btnSaveSync.disabled = disabled;
};

/**
 * Parses the text in the local settings text area into JSON, and updates the UI if it succeed or fails to parse.
 */
export const canParseLocal = async (settings?: string) => {
  try {
    if (!settings) {
      settings = getElem<HTMLTextAreaElement>('localSettingsTextArea').value;
    }
    JSON.parse(settings);
    setValidationText('Local settings are valid JSON.', 'primary');
    await setSaveSettingsButtonsDisabled(false);
    await checkSettingsEqual();
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    setValidationText('Invalid local settings JSON.', 'danger');
    await setSaveSettingsButtonsDisabled(true);
    return false;
  }
};

/**
 * Checks if the saved local and sync settings are equal to each other, and updates UI elements according to the result.
 */
export const checkSettingsEqual = async () => {
  if (!objectEquals(await getSyncSettings(), await getLocalSettings())) {
    setValidationText('Local/sync settings do not match.', 'danger');
    return false;
  } else {
    setValidationText('Local/sync settings match!', 'success');
    return true;
  }
};

/**
 * Retrieves the extension's locally saved settings, and updates the UI to reflect them.
 */
export const reflectLocalSettings = async () => {
  try {
    const local = await getLocalSettings();
    const str = JSON.stringify(local);
    await canParseLocal(str);
    getElem<HTMLTextAreaElement>('localSettingsTextArea').value = str;
    getElem<HTMLInputElement>('alwaysSetSync').checked = local.alwaysSetSync;
    getElem<HTMLInputElement>('alwaysGetSync').checked = local.alwaysGetSync;
    getElem<HTMLInputElement>('neverConfirmForOpeningNonHttpUrls').checked = local.neverConfirmOpenNonHttpUrls;
    getElem<HTMLInputElement>('neverConfirmForSavingNonHttpUrls').checked = local.neverConfirmSaveNonHttpUrls;
    getElem<HTMLInputElement>('openCurrentTabUrlOnMatchSelect').value = local.openCurrentTabUrlOnMatch;
    return local;
  } catch (err) {
    throw `Failed to reflect local settings: ${err}`;
  }
};

/**
 * Retrieves the extension's saved sync settings, and updates the UI to reflect them.
 */
export const reflectSyncSettings = async () => {
  try {
    const sync = await getSyncSettings();
    await checkSettingsEqual();
    getElem<HTMLTextAreaElement>('syncSettingsTextArea').value = JSON.stringify(sync);
    return sync;
  } catch (err) {
    throw `Error reflecting sync settings: ${err}`;
  }
};

/**
 * Attempts to parse the local input settings text area. Shows modals upon parse failure, so there's no need to show
 * modals upon failure elsewhere, although this honestly is not an optimal choice and should be updated later.
 */
export const getConfigFromLocalSettingsTextArea = async () => {
  try {
    const local = getElem<HTMLTextAreaElement>('localSettingsTextArea');
    const valid = await canParseLocal(local.value);
    if (!valid) throw 'The provided local settings do not appear to be valid.';
    return JSON.parse(local.value) as ExtensionConfig;
  } catch (err) {
    throw `Failed get settings from Local Settings text area: ${err}`;
  }
};

/**
 * `saveSyncSettings` is identical to `saveLocalSettings`, except it saves to sync instead of local - it even has to
 * validate the user input correctly before saving.
 */
export const saveSyncSettings = async () => {
  const text = getElem<HTMLTextAreaElement>('localSettingsTextArea');
  const valid = canParseLocal(text.value);
  if (!valid) throw 'The provided local settings do not appear to be valid.';

  const settings = JSON.parse(text.value) as ExtensionConfig;
  await setSyncSettings(settings);

  await reflectSyncSettings();
  await canParseLocal();
};

export const onChangeLocalSettings = async (e: KeyboardEvent) => {
  if (!e || !e.target) return;
  const target = e.target as HTMLInputElement;
  if (!target?.value) return;
  await canParseLocal(target.value);
};

/**
 * Previously named `exportContainers`, this function retrieves all containers and updates the bulk export text area to
 * reflect their JSON contents, including their `defaultUrl` values.
 */
export const reflectContexts = async () => {
  try {
    const contexts = await bulkExport();
    getElem<HTMLTextAreaElement>('containersExportAsJSON').value = JSON.stringify(contexts);
  } catch (err) {
    throw `failed to reflect contexts: ${err}`;
  }
};
