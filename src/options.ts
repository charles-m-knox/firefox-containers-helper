import { alertOnError } from './modules/helpers';
import { showConfirm } from './modules/modals/modals';
import { COMMAND_NAME } from './modules/constants';
import { getElem } from './modules/get';
import { checkDirty } from './modules/helpers/checkDirty';
import {
  onChangeLocalSettings,
  reflectContexts,
  reflectKeyboardShortcut,
  reflectLocalSettings,
  reflectSyncSettings,
} from './modules/preferences/lib';
import {
  btnCleanLocalClick,
  btnExportContainersClick,
  btnImportContainersClick,
  btnLoadFromSyncClick,
  btnRefreshSyncClick,
  btnResetLocalClick,
  btnResetLocalSettingsClick,
  btnResetSyncSettingsClick,
  btnSaveLocalClick,
  btnSaveSyncClick,
  btnUpdateShortcutClick,
  onChangeUrlMatchType,
  resetShortcut,
  toggleOptionCheckbox,
} from './modules/preferences/handlers';

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
    getElem<HTMLButtonElement>('reset').addEventListener('click', () => resetShortcut(COMMAND_NAME));
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
