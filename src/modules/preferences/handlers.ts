import { ExtensionConfig } from '../../types';
import { browserCommandsReset, browserCommandsUpdate } from '../browser/commands';
import { browserStorageLocalClear, browserStorageSyncClear } from '../browser/storage';
import { setLocalSettings, setSyncSettings, getSyncSettings } from '../config';
import { setSettings } from '../config/setSettings';
import { COMMAND_NAME, UrlMatchType } from '../constants';
import { getElem } from '../get';
import { alertOnError, getCleanSettings } from '../helpers';
import { showAlert, showConfirm } from '../modals/modals';
import { bulkImport } from '../preferences';
import {
  reflectLocalSettings,
  reflectKeyboardShortcut,
  reflectSyncSettings,
  canParseLocal,
  getConfigFromLocalSettingsTextArea,
  checkSettingsEqual,
  saveSyncSettings,
  reflectContexts,
} from './lib';

export const btnImportContainersClick = () =>
  alertOnError(async () => {
    const imported = await bulkImport(getElem<HTMLTextAreaElement>('containersImportAsJSON').value);
    const s = imported.length === 1 ? '' : 's';
    await reflectLocalSettings();
    await showAlert(`Imported ${imported.length} container${s}.`, 'Bulk Import');
  })('Error during bulk import', 'Bulk Import Error');

/** Reset the keyboard shortcut and update the text box. */
export const resetShortcut = async (cmd: string) =>
  alertOnError(async () => {
    await browserCommandsReset(cmd);
    await reflectKeyboardShortcut();
  })(`Failed to reset the keyboard shortcut`, 'Keyboard Shortcut Error');

/** Update the shortcut based on the value in the text box. */
export const btnUpdateShortcutClick = () =>
  alertOnError(
    async () =>
      await browserCommandsUpdate({
        name: COMMAND_NAME,
        shortcut: getElem<HTMLInputElement>('shortcut').value,
      }),
  )('Failed to set the keyboard shortcut', 'Keyboard Shortcut Error');

export const btnResetLocalClick = () =>
  alertOnError(async () => await reflectLocalSettings())(`Failed to reset local settings`, 'Reset Error');

export const btnRefreshSyncClick = () =>
  alertOnError(async () => {
    await reflectSyncSettings();
    await canParseLocal();
  })('Failed to refresh sync settings', 'Refresh Error');

export const btnSaveLocalClick = () =>
  alertOnError(async () => {
    await setLocalSettings(await getConfigFromLocalSettingsTextArea());
    await checkSettingsEqual();
  })(`Failed to save local settings`, 'Settings Error');

export const btnSaveSyncClick = () =>
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
export const btnCleanLocalClick = async () => {
  const proceed = await showConfirm(
    `Sometimes, a container gets deleted, but its URL association within Containers Helper might stay configured. This can stack up over time, and the extension's settings can exceed Firefox Sync quota. This requires a cleanup - generally, this is safe, but if you have important old URLs stored in the Local Settings text field, please copy/paste them to a safe place before continuing, because they will be removed. You will also be given the chance to save the cleaned-up configuration immediately, or continue to edit it. Note that this will also de-select any selected containers from the popup list of containers. If you have more than 1000 cleanup targets, this may take a moment. Proceed?`,
    'Clean Up Config?',
  );
  if (!proceed) return;

  const settings = await getConfigFromLocalSettingsTextArea();
  if (!settings) return;
  const [cleaned, removed] = await getCleanSettings(settings);
  getElem<HTMLTextAreaElement>('localSettingsTextArea').value = JSON.stringify(cleaned);

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
export const toggleOptionCheckbox = () =>
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

export const onChangeUrlMatchType = async (event: Event) =>
  alertOnError(async () => {
    const select = getElem<HTMLSelectElement>('openCurrentTabUrlOnMatchSelect');
    if (!event) throw 'The event information is not present for the openCurrentTabUrlOnMatch select callback.';
    if (!event.target)
      throw 'The event target information is not present for the openCurrentTabUrlOnMatch select callback.';

    await setSettings({
      openCurrentTabUrlOnMatch: select.value as UrlMatchType,
    } as Partial<ExtensionConfig>);

    await reflectLocalSettings();
    await reflectSyncSettings();
  })('Failed to change URL match type', 'Settings Error');

export const btnLoadFromSyncClick = () =>
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

export const btnResetLocalSettingsClick = () =>
  alertOnError(async () => {
    const question = 'Are you sure you want to reset local settings? You may not be able to undo this.';
    if (!(await showConfirm(question, 'Reset local settings?'))) return;
    await browserStorageLocalClear();
    await reflectLocalSettings();
  })('Failed to clear local settings', 'Clear Settings Error');

export const btnResetSyncSettingsClick = () =>
  alertOnError(async () => {
    const question = 'Are you sure you want to reset sync settings? You may not be able to undo this.';
    if (!(await showConfirm(question, 'Reset sync settings?'))) return;
    await browserStorageSyncClear();
    await reflectSyncSettings();
  })('Failed to clear sync settings', 'Clear Settings Error');

export const btnExportContainersClick = () =>
  alertOnError(async () => {
    await reflectContexts();
  })('Failed to export containers', 'Export Error');
