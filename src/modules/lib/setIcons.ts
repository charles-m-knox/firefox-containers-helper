import { Container } from '../../types';
import { CONTEXT_ICONS } from '../constants';
import { showPrompt, showAlert } from '../modals/modals';
import { update } from './update';

/** Sets the icon of one or more containers simultaneously. */
export const setIcons = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';

  const prefill = one ? containers[0].icon : '';

  const msg = `Choose an icon for ${containers.length} container${s} from the following list:\n\n${CONTEXT_ICONS.join(
    ', ',
  )}`;
  const icon = await showPrompt(msg, 'Choose Icon', prefill);

  if (!icon) {
    return;
  }

  if (CONTEXT_ICONS.indexOf(icon) === -1) {
    await showAlert(`The value ${icon} is not a valid container icon.`, 'Invalid Icon');
    return;
  }

  await update(containers, 'icon', icon);
};
