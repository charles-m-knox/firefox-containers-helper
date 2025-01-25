import { Container } from '../../types';
import { CONTEXT_COLORS } from '../constants';
import { update } from './update';
import { showPrompt, showAlert } from '../modals/modals';

/** Sets the color of one or more containers simultaneously. */
export const setColors = async (containers: Container[]) => {
  const one = containers.length === 1;
  const s = one ? '' : 's';
  const prefill = one ? containers[0].color : '';
  const msg = `Choose a color for ${containers.length} container${s} from the following list:\n\n${CONTEXT_COLORS.join(
    ', ',
  )}`;

  const color = await showPrompt(msg, 'Choose Color', prefill);
  if (!color) {
    // TODO: !color is indistinguishable from the user pressing "cancel" at prompt
    // showAlert('Please provide a non-empty, valid color value.', 'Invalid Color');
    return;
  }

  if (CONTEXT_COLORS.indexOf(color) === -1) {
    await showAlert(`The value ${color} is not a valid container color.`, 'Invalid Color');
    return;
  }

  await update(containers, 'color', color);
};
