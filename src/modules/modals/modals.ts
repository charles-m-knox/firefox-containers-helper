import { hideElement, replaceElement, showElement } from '../dom';
import { getElemNullable } from '../get';

export enum ModalType {
  Alert = 'modal-type-alert',
  Confirm = 'modal-type-confirm',
  Prompt = 'modal-type-prompt',
}

export enum ModalState {
  Show = 'modal-show',
  Open = 'modal-open',
  Hide = 'modal-hide',
}

export const getModal = () => getElemNullable<HTMLDivElement>('modal');
// modal buttons
export const getModalBtnConfirmCancel = () => getElemNullable<HTMLButtonElement>('btnModalConfirmCancel');
export const getModalBtnConfirmSecondary = () => getElemNullable<HTMLButtonElement>('btnModalConfirmSecondary');
export const getModalBtnConfirmPrimary = () => getElemNullable<HTMLButtonElement>('btnModalConfirmPrimary');
export const getModalBtnAlertOK = () => getElemNullable<HTMLButtonElement>('btnModalAlertOK');
export const getModalBtnPromptCancel = () => getElemNullable<HTMLButtonElement>('btnModalPromptCancel');
export const getModalBtnPromptOK = () => getElemNullable<HTMLButtonElement>('btnModalPromptOK');
// modal content
export const getModalAlertContent = () => getElemNullable<HTMLDivElement>('modalAlertContent');
export const getModalConfirmContent = () => getElemNullable<HTMLDivElement>('modalConfirmContent');
export const getModalPromptContent = () => getElemNullable<HTMLDivElement>('modalPromptContent');
// modal text spans
export const getModalAlertText = () => getElemNullable<HTMLSpanElement>('modalAlertText');
export const getModalConfirmText = () => getElemNullable<HTMLSpanElement>('modalConfirmText');
export const getModalPromptText = () => getElemNullable<HTMLSpanElement>('modalPromptText');
// modal prompt input
export const getModalPromptInput = () => getElemNullable<HTMLInputElement>('modalPromptInput');
// modal titles
export const getModalAlertTitle = () => getElemNullable<HTMLHeadingElement>('modalAlertTitle');
export const getModalConfirmTitle = () => getElemNullable<HTMLHeadingElement>('modalConfirmTitle');
export const getModalPromptTitle = () => getElemNullable<HTMLHeadingElement>('modalPromptTitle');
// modal input
export const getModalPromptInputText = (): string => getModalPromptInput()?.value || '';

/** Hides the modal by setting a few classes. */
export const hideModal = () => {
  const modal = getModal();
  if (!modal) return;

  modal.classList.remove(ModalState.Show, ModalState.Open);
  modal.classList.add(ModalState.Hide);
};

/** Shows the modal by setting a few classes. */
export const showModal = () => {
  const modal = getModal();
  if (!modal) return;
  modal.classList.remove(ModalState.Hide);
  modal.classList.add(ModalState.Show, ModalState.Open);
};

/**
 * Hides all of the modal content bodies, and shows the requested modal type.
 */
export const setModalType = (type: ModalType) => {
  const promptContent = getModalPromptContent();
  const confirmContent = getModalConfirmContent();
  const alertContent = getModalAlertContent();
  hideElement(promptContent);
  hideElement(confirmContent);
  hideElement(alertContent);

  switch (type) {
    case ModalType.Alert:
      showElement(alertContent);
      break;
    case ModalType.Confirm:
      showElement(confirmContent);
      break;
    case ModalType.Prompt:
      showElement(promptContent);
      break;
  }
};

/**
 * Sets the callbacks for the `clicked` event listener for the OK button in the Alert modal only.
 *
 * @param ok The callback to fire when clicking the OK button.
 */
const setModalAlertCallback = (ok: () => void) => replaceElement(getModalBtnAlertOK())?.addEventListener('click', ok);

/**
 * Sets the callbacks for the `clicked` event listener for each button, for the Confirm modal only. If changing this
 * code, please preserve the order in which the buttons are replaced via `replaceElement`.
 *
 * @param primary The callback to fire when clicking the primary button
 * @param secondary The callback to fire when clicking the secondary button
 * @param cancel The callback to fire when clicking the cancel button
 */
const setModalConfirmCallbacks = (primary: () => void, secondary: () => void, cancel: () => void) => {
  replaceElement(getModalBtnConfirmCancel())?.addEventListener('click', cancel);
  replaceElement(getModalBtnConfirmSecondary())?.addEventListener('click', secondary);
  replaceElement(getModalBtnConfirmPrimary())?.addEventListener('click', primary);
};

/**
 * Sets the callbacks for the `clicked` event listener for each button, for the Prompt modal only. If changing this
 * code, please preserve the order in which the buttons are replaced via `replaceElement`.
 *
 * @param ok The callback to fire when clicking the primary button
 * @param cancel The callback to fire when clicking the cancel button
 */
const setModalPromptCallbacks = (ok: () => void, cancel: () => void) => {
  replaceElement(getModalBtnPromptCancel())?.addEventListener('click', cancel);
  replaceElement(getModalBtnPromptOK())?.addEventListener('click', ok);
};

/**
 * Shows a simple modal with the provided alert message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 */
export const showAlert = async (msg: string, title: string) => {
  setModalType(ModalType.Alert);
  setModalAlertCallback(hideModal);

  {
    const el = getModalAlertText();
    if (el) el.innerText = msg;
  }

  {
    const el = getModalAlertTitle();
    if (el) el.innerText = title;
  }

  showModal();
  getModalBtnAlertOK()?.focus();
};

/**
 * Shows a confirm modal with the provided message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 * @return A promise containing `true`/`false` for yes/no, or `null` for cancel.
 */
export const showConfirm = async (msg: string, title: string) => {
  setModalType(ModalType.Confirm);

  const promise = new Promise((resolve: (v: boolean | null) => void) => {
    setModalConfirmCallbacks(
      () => {
        hideModal();
        return resolve(true);
      },
      () => {
        hideModal();
        return resolve(false);
      },
      () => {
        hideModal();
        return resolve(null);
      },
    );
  });

  {
    const el = getModalConfirmText();
    if (el) el.innerText = msg;
  }

  {
    const el = getModalConfirmTitle();
    if (el) el.innerText = title;
  }

  showModal();
  getModalBtnConfirmCancel()?.focus();
  return await promise;
};

/**
 * Shows a prompt modal with the provided message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 * @param value Optional value to pre-fill the prompt text field with.
 * @return A promise containing `true`/`false` for yes/no, or `null` for cancel.
 */
export const showPrompt = async (msg: string, title: string, value?: string) => {
  setModalType(ModalType.Prompt);

  // replaceElement(getModalPromptText());
  const promptInput = replaceElement(getModalPromptInput());
  if (!promptInput) throw 'Error: Prompt input field is not available.';

  const promise = new Promise((resolve: (v: string | null) => void) => {
    const completed = () => {
      hideModal();
      return resolve(getModalPromptInputText());
    };

    promptInput?.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        completed();
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
    });

    setModalPromptCallbacks(completed, () => {
      hideModal();
      return resolve(null);
    });
  });

  {
    const el = getModalPromptText();
    if (el) el.innerText = msg;
  }

  {
    const el = getModalPromptTitle();
    if (el) el.innerText = title;
  }

  {
    const el = getModalPromptInput();
    if (el) el.innerText = value || '';
  }

  showModal();
  promptInput.focus();
  return await promise;
};
