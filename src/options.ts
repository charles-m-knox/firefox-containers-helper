import { getLocalSettings, getSyncSettings, setLocalSettings, setSettings, setSyncSettings } from './modules/config';
import { alertOnError, checkDirty, getCleanSettings, objectEquals } from './modules/helpers';
import { bulkExport, bulkImport } from './modules/preferences';
import { showAlert, showConfirm } from './modules/modals/modals';
import { ExtensionConfig } from './types';
import { UrlMatchTypes } from './modules/constants';
import { getElem, getElemNullable } from './modules/get';
import { browserCommandsUpdate, browserCommandsReset, browserCommandsGetAll } from './modules/browser/commands';
import { browserStorageLocalClear, browserStorageSyncClear } from './modules/browser/storage';

// https://github.com/mdn/webextensions-examples/blob/60ce50b10ee66f6d706b0715909e756e4bdba63d/commands/options.js
// https://github.com/mdn/webextensions-examples/blob/60ce50b10ee66f6d706b0715909e756e4bdba63d/commands/options.html
const commandName = '_execute_browser_action';

/** Reflects the saved value for the keyboard shortcut to show the popup. */
const reflectKeyboardShortcut = async () => {
  const shortcut = getElemNullable<HTMLInputElement>('shortcut');
  if (!shortcut) {
    await showAlert('Error: Element with ID shortcut is not present.', 'HTML Error');
    return;
  }

  const commands = await browserCommandsGetAll();
  for (const command of commands) {
    if (command.name === commandName && command.shortcut) {
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
const setValidationText = (msg: string, color: string) => {
  if (!msg || !color) return;

  const syncValidationText = getElem<HTMLSpanElement>('syncValidationText');
  const className = `badge badge-${color} mt-4`;

  syncValidationText.innerText = msg;
  syncValidationText.className = className;
};

const setSaveSettingsButtonsDisabled = async (disabled: boolean) => {
  const btnSaveLocal = getElem<HTMLButtonElement>('btnSaveLocal');
  const btnSaveSync = getElem<HTMLButtonElement>('btnSaveSync');
  btnSaveLocal.disabled = disabled;
  btnSaveSync.disabled = disabled;
};

/**
 * Parses the text in the local settings text area into JSON, and updates
 * the UI if it succeed or fails to parse.
 */
const canParseLocal = async (settings?: string): Promise<boolean> => {
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
 * Checks if the saved local and sync settings are equal to each other, and
 * updates UI elements according to the result.
 */
const checkSettingsEqual = async () => {
  const sync = await getSyncSettings();
  const local = await getLocalSettings();

  const equal = objectEquals(sync, local);

  if (!equal) {
    setValidationText('Local/sync settings do not match.', 'danger');
    return equal;
  }

  setValidationText('Local/sync settings match!', 'success');
  return equal;
};

/**
 * Retrieves the extension's locally saved settings, and updates the UI to
 * reflect them.
 */
const reflectLocalSettings = async () => {
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
 * Retrieves the extension's saved sync settings, and updates the UI to
 * reflect them.
 */
const reflectSyncSettings = async () => {
  try {
    const sync = await getSyncSettings();
    await checkSettingsEqual();
    getElem<HTMLTextAreaElement>('syncSettingsTextArea').value = JSON.stringify(sync);
    return sync;
  } catch (err) {
    throw `Error reflecting sync settings: ${err}`;
  }
};

const getLocalSettingsTextArea = () => getElem<HTMLTextAreaElement>('localSettingsTextArea');

/**
 * Attempts to parse the local input settings text area. Shows modals upon parse
 * failure, so there's no need to show modals upon failure elsewhere, although
 * this honestly is not an optimal choice and should be updated later.
 */
const getConfigFromLocalSettingsTextArea = async () => {
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
 * `saveSyncSettings` is identical to `saveLocalSettings`, except it saves to sync
 * instead of local - it even has to validate the user input correctly before
 * saving.
 */
const saveSyncSettings = async () => {
  const text = getElem<HTMLTextAreaElement>('localSettingsTextArea');
  const valid = canParseLocal(text.value);
  if (!valid) throw 'The provided local settings do not appear to be valid.';

  const settings = JSON.parse(text.value) as ExtensionConfig;
  await setSyncSettings(settings);

  await reflectSyncSettings();
  await canParseLocal();
};

const onChangeLocalSettings = async (e: KeyboardEvent) => {
  if (!e || !e.target) return;
  const target = e.target as HTMLInputElement;
  if (!target?.value) return;
  await canParseLocal(target.value);
};

/**
 * Previously named `exportContainers`, this function retrieves all containers
 * and updates the bulk export text area to reflect their JSON contents,
 * including their `defaultUrl` values.
 */
const reflectContexts = async () => {
  try {
    const contexts = await bulkExport();
    getElem<HTMLTextAreaElement>('containersExportAsJSON').value = JSON.stringify(contexts);
  } catch (err) {
    throw `failed to reflect contexts: ${err}`;
  }
};

const btnImportContainersClick = () =>
  alertOnError(async () => {
    const imported = await bulkImport(getElem<HTMLTextAreaElement>('containersImportAsJSON').value);
    const s = imported.length === 1 ? '' : 's';
    await reflectLocalSettings();
    await showAlert(`Imported ${imported.length} container${s}.`, 'Bulk Import');
  })('Error during bulk import', 'Bulk Import Error');

/** Reset the keyboard shortcut and update the text box. */
const resetShortcut = async (cmd: string) =>
  alertOnError(async () => {
    await browserCommandsReset(cmd);
    await reflectKeyboardShortcut();
  })(`Failed to reset the keyboard shortcut`, 'Keyboard Shortcut Error');

/** Update the shortcut based on the value in the text box. */
const btnUpdateShortcutClick = () =>
  alertOnError(
    async () =>
      await browserCommandsUpdate({
        name: commandName,
        shortcut: getElem<HTMLInputElement>('shortcut').value,
      }),
  )('Failed to set the keyboard shortcut', 'Keyboard Shortcut Error');

const btnResetLocalClick = () =>
  alertOnError(async () => await reflectLocalSettings())(`Failed to reset local settings`, 'Reset Error');

const btnRefreshSyncClick = () =>
  alertOnError(async () => {
    await reflectSyncSettings();
    await canParseLocal();
  })('Failed to refresh sync settings', 'Refresh Error');

const btnSaveLocalClick = () =>
  alertOnError(async () => {
    await setLocalSettings(await getConfigFromLocalSettingsTextArea());
    await checkSettingsEqual();
  })(`Failed to save local settings`, 'Settings Error');

const btnSaveSyncClick = () =>
  alertOnError(async () => {
    if (
      !(await showConfirm(
        'Are you sure you want to overwrite your sync settings with your current local settings? This will overwrite values, but will not unset values.',
        'Risky Operation',
      ))
    )
      return;
    await saveSyncSettings();
    await checkSettingsEqual();
    await showAlert('Successfully saved local settings to sync storage.', 'Success');
  })('Failed to save sync settings', 'Settings Error');

/**
 * Asks the user if they want to clean up the config, and then proceeds to
 * remove any default URL's from the config that do not map to any existing
 * containers.
 */
const btnCleanLocalClick = async () => {
  const proceed = await showConfirm(
    `Sometimes, a container gets deleted, but its URL association within Containers Helper might stay configured. This can stack up over time, and the extension's settings can exceed Firefox Sync quota. This requires a cleanup - generally, this is safe, but if you have important old URLs stored in the Local Settings text field, please copy/paste them to a safe place before continuing, because they will be removed. You will also be given the chance to save the cleaned-up configuration immediately, or continue to edit it. Note that this will also de-select any selected containers from the popup list of containers. If you have more than 1000 cleanup targets, this may take a moment. Proceed?`,
    'Clean Up Config?',
  );
  if (!proceed) return;

  const settings = await getConfigFromLocalSettingsTextArea();
  if (!settings) return;
  const [cleaned, removed] = await getCleanSettings(settings);
  const localSettingsTextArea = await getLocalSettingsTextArea();
  if (!localSettingsTextArea) return;
  localSettingsTextArea.value = JSON.stringify(cleaned);

  const s = removed.length === 1 ? '' : 's';
  const save = await showConfirm(
    `Cleaned up ${removed.length} orphaned URL association${s}. You can view the new configuration in the Local Settings text field. Would you like to save to the local config now?`,
    'Cleaning Success',
  );
  if (!save) return;

  await btnSaveLocalClick();
};

/**
 * Upon toggling a checkbox, the value of that checkbox is propagated to sync
 * and to local storage. Also pushes all other boolean-valued checkboxes.
 */
const toggleOptionCheckbox = () =>
  alertOnError(async () => {
    // these two values are always pushed to firefox sync
    // and stored locally
    const special: Partial<ExtensionConfig> = {
      alwaysSetSync: getElem<HTMLInputElement>('alwaysSetSync').checked,
      alwaysGetSync: getElem<HTMLInputElement>('alwaysGetSync').checked,
    };

    await setLocalSettings(special);
    await setSyncSettings(special);

    await setSettings({
      neverConfirmOpenNonHttpUrls: getElem<HTMLInputElement>('neverConfirmForOpeningNonHttpUrls').checked,
      neverConfirmSaveNonHttpUrls: getElem<HTMLInputElement>('neverConfirmForSavingNonHttpUrls').checked,
    } as Partial<ExtensionConfig>);

    await reflectLocalSettings();
    await reflectSyncSettings();
  })('Failed to toggle option to always get/set to sync', 'Settings Error');

const onChangeUrlMatchType = async (event: Event) =>
  alertOnError(async () => {
    const select = getElem<HTMLSelectElement>('openCurrentTabUrlOnMatchSelect');
    if (!event) throw 'The event information is not present for the openCurrentTabUrlOnMatch select callback.';
    if (!event.target)
      throw 'The event target information is not present for the openCurrentTabUrlOnMatch select callback.';

    await setSettings({
      openCurrentTabUrlOnMatch: select.value as UrlMatchTypes,
    } as Partial<ExtensionConfig>);

    await reflectLocalSettings();
    await reflectSyncSettings();
  })('Failed to change URL match type', 'Settings Error');

const btnLoadFromSyncClick = () =>
  alertOnError(async () => {
    const sync = await getSyncSettings();
    if (!sync) throw 'No sync data was retrieved.';

    if (
      !(await showConfirm(
        'Are you sure you want to overwrite your local settings with sync settings? This will overwrite values, but will not unset values.',
        'Risky Operation',
      ))
    )
      return;
    await setLocalSettings(sync);
    await reflectLocalSettings();
    await reflectSyncSettings();
    await showAlert('Successfully saved sync settings to local storage.', 'Success');
  })('Failed to load settings from sync', 'Settings Error');

const btnResetLocalSettingsClick = () =>
  alertOnError(async () => {
    const question = 'Are you sure you want to reset local settings? You may not be able to undo this.';
    if (!(await showConfirm(question, 'Reset local settings?'))) return;
    await browserStorageLocalClear();
    await reflectLocalSettings();
  })('Failed to clear local settings', 'Clear Settings Error');

const btnResetSyncSettingsClick = () =>
  alertOnError(async () => {
    const question = 'Are you sure you want to reset sync settings? You may not be able to undo this.';
    if (!(await showConfirm(question, 'Reset sync settings?'))) return;
    await browserStorageSyncClear();
    await reflectSyncSettings();
  })('Failed to clear sync settings', 'Clear Settings Error');

const btnExportContainersClick = () =>
  alertOnError(async () => {
    await reflectContexts();
  })('Failed to export containers', 'Export Error');

const init = () =>
  alertOnError(async () => {
    const local = await reflectLocalSettings();
    await reflectSyncSettings();
    await reflectContexts();
    await reflectKeyboardShortcut();

    getElem<HTMLInputElement>('alwaysGetSync').addEventListener('click', toggleOptionCheckbox);
    getElem<HTMLInputElement>('alwaysSetSync').addEventListener('click', toggleOptionCheckbox);
    getElem<HTMLSelectElement>('btnCleanLocal').addEventListener('click', btnCleanLocalClick);
    getElem<HTMLButtonElement>('btnExportContainers').addEventListener('click', btnExportContainersClick);
    getElem<HTMLButtonElement>('btnImportContainersJSON').addEventListener('click', btnImportContainersClick);
    getElem<HTMLButtonElement>('btnLoadFromSync').addEventListener('click', btnLoadFromSyncClick);
    getElem<HTMLButtonElement>('btnRefreshSync').addEventListener('click', btnRefreshSyncClick);
    getElem<HTMLButtonElement>('btnResetLocal').addEventListener('click', btnResetLocalClick);
    getElem<HTMLButtonElement>('btnResetLocalSettings').addEventListener('click', btnResetLocalSettingsClick);
    getElem<HTMLButtonElement>('btnResetSyncSettings').addEventListener('click', btnResetSyncSettingsClick);
    getElem<HTMLButtonElement>('btnSaveLocal').addEventListener('click', btnSaveLocalClick);
    getElem<HTMLButtonElement>('btnSaveSync').addEventListener('click', btnSaveSyncClick);
    getElem<HTMLTextAreaElement>('localSettingsTextArea').addEventListener('keyup', onChangeLocalSettings);
    getElem<HTMLInputElement>('neverConfirmForOpeningNonHttpUrls').addEventListener('click', toggleOptionCheckbox);
    getElem<HTMLInputElement>('neverConfirmForSavingNonHttpUrls').addEventListener('click', toggleOptionCheckbox);
    getElem<HTMLSelectElement>('openCurrentTabUrlOnMatchSelect').addEventListener('change', onChangeUrlMatchType);
    getElem<HTMLButtonElement>('reset').addEventListener('click', () => resetShortcut(commandName));
    getElem<HTMLButtonElement>('update').addEventListener('click', btnUpdateShortcutClick);

    // check if the config is dirty
    if (!local) return;
    const dirty = await checkDirty(local);
    if (dirty <= 0) return;

    const s = dirty === 1 ? '' : 's';
    const are = dirty === 1 ? 'is' : 'are';

    const cleanUp = await showConfirm(
      `Warning: There ${are} ${dirty} orphaned container/URL association${s} in the config. You can request a cleanup of the extension's saved settings. It is recommended to proceed so that the extension can consume less storage space and operate more efficiently. Would you like to begin the cleanup? You will be prompted with more information.`,
      'Clean Up Config?',
    );
    if (!cleanUp) return;
    await btnCleanLocalClick();
  })('Failed to initialize', 'Initialization Error');

document.addEventListener('DOMContentLoaded', init);
