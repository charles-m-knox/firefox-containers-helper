import { getSetting } from './modules/config/getSetting';
import { PlatformModifierKey, ConfKey } from './modules/constants';
import { checkDirty } from './modules/helpers/checkDirty';
import { helpful } from './modules/helpful';
import { help } from './modules/help';
import { filter } from './modules/lib/filter';
import { showAlert } from './modules/modals/modals';
import { setHandlers } from './modules/handlers';
import { reflectSettings } from './modules/elements';
import { getElemNullable } from './modules/get';
import { ensureConfig } from './modules/config/ensureConfig';
import { getSettings } from './modules/config/getSettings';

const init = async () => {
  if (!document) return;

  try {
    await ensureConfig();
    await reflectSettings();
    await filter();

    if ((await getSetting<boolean>(ConfKey.selectionMode)) === true) {
      help(`${PlatformModifierKey}+Click to select 1; ${PlatformModifierKey}+Shift+Click for a range`);
    } else {
      await helpful();
    }

    setHandlers();

    getElemNullable<HTMLInputElement>('searchContainerInput')?.focus();

    // check if the config is dirty
    const settings = await getSettings();
    if (!settings) return;

    const dirty = await checkDirty(settings);
    if (dirty <= 0) return;

    const s = dirty === 1 ? '' : 's';
    const msg = `Cleanup needed, visit Preferences (${dirty} orphan${s})`;

    help(msg);
  } catch (err) {
    const msg = 'Failed to initialize page';
    const title = 'Initialization Error';
    if (err) {
      await showAlert(`${msg} due to error: ${err}`, title);
      return;
    }

    await showAlert(`${msg} due to an unknown error.`, title);
  }
};

document.addEventListener('DOMContentLoaded', async () => init());
