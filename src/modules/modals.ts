// -- constants

import { hideElement, scrollToTop, showElement } from "./helpers";

// modal types
export const MODAL_TYPE_ALERT = 'modal-type-alert';
export const MODAL_TYPE_CONFIRM = 'modal-type-confirm';
export const MODAL_TYPE_PROMPT = 'modal-type-prompt';

// modal id's
export const MODAL_ID = "modal";

// modal classes
export const MODAL_CLASS_SHOW = 'modal-show'
export const MODAL_CLASS_OPEN = 'modal-open'
export const MODAL_CLASS_HIDE = 'modal-hide'

// modal buttons
export const MODAL_BTN_CONFIRM_CANCEL = 'btnModalConfirmCancel';
export const MODAL_BTN_CONFIRM_SECONDARY = 'btnModalConfirmSecondary';
export const MODAL_BTN_CONFIRM_PRIMARY = 'btnModalConfirmPrimary';
export const MODAL_BTN_ALERT_OK = 'btnModalAlertOK';
export const MODAL_BTN_PROMPT_CANCEL = 'btnModalPromptCancel';
export const MODAL_BTN_PROMPT_OK = 'btnModalPromptOK';

// modal content
export const MODAL_ALERT_CONTENT = 'modalAlertContent';
export const MODAL_CONFIRM_CONTENT = 'modalConfirmContent';
export const MODAL_PROMPT_CONTENT = 'modalPromptContent';

// modal text spans
export const MODAL_ALERT_TEXT = 'modalAlertText';
export const MODAL_CONFIRM_TEXT = 'modalConfirmText';
export const MODAL_PROMPT_TEXT = 'modalPromptText';

// modal prompt input
export const MODAL_PROMPT_INPUT = 'modalPromptInput';

// modal titles
export const MODAL_ALERT_TITLE = 'modalAlertTitle';
export const MODAL_CONFIRM_TITLE = 'modalConfirmTitle';
export const MODAL_PROMPT_TITLE = 'modalPromptTitle';

// -- simple helper functions

// modal id's
const getModal = () => document.getElementById(MODAL_ID);

// modal buttons
const getModalBtnConfirmCancel = () => document.getElementById(MODAL_BTN_CONFIRM_CANCEL);
const getModalBtnConfirmSecondary = () => document.getElementById(MODAL_BTN_CONFIRM_SECONDARY);
const getModalBtnConfirmPrimary = () => document.getElementById(MODAL_BTN_CONFIRM_PRIMARY);
const getModalBtnAlertOK = () => document.getElementById(MODAL_BTN_ALERT_OK);
const getModalBtnPromptCancel = () => document.getElementById(MODAL_BTN_PROMPT_CANCEL);
const getModalBtnPromptOK = () => document.getElementById(MODAL_BTN_PROMPT_OK);

// modal content
const getModalAlertContent = () => document.getElementById(MODAL_ALERT_CONTENT);
const getModalConfirmContent = () => document.getElementById(MODAL_CONFIRM_CONTENT);
const getModalPromptContent = () => document.getElementById(MODAL_PROMPT_CONTENT);

// modal text spans
const getModalAlertText = () => document.getElementById(MODAL_ALERT_TEXT);
const getModalConfirmText = () => document.getElementById(MODAL_CONFIRM_TEXT);
const getModalPromptText = () => document.getElementById(MODAL_PROMPT_TEXT);

// modal prompt input
const getModalPromptInput = () => document.getElementById(MODAL_PROMPT_INPUT);

// modal titles
const getModalAlertTitle = () => document.getElementById(MODAL_ALERT_TITLE);
const getModalConfirmTitle = () => document.getElementById(MODAL_CONFIRM_TITLE);
const getModalPromptTitle = () => document.getElementById(MODAL_PROMPT_TITLE);

const getModalPromptInputText = (): string => {
    const el = getModalPromptInput();
    if (!el) return '';
    return (el as HTMLInputElement).value;
}

// setter functions

const setModalAlertText = (txt: string) => {
    const el = getModalAlertText();
    if (!el) return;
    el.innerText = txt;
}

const setModalConfirmText = (txt: string) => {
    const el = getModalConfirmText();
    if (!el) return;
    el.innerText = txt;
}

const setModalPromptText = (txt: string) => {
    const el = getModalPromptText();
    if (!el) return;
    el.innerText = txt;
}

const setModalPromptInputText = (text: string) => {
    const el = getModalPromptInput();
    if (!el) return;
    (el as HTMLInputElement).value = text;
}

const setModalAlertTitle = (txt: string) => {
    const el = getModalAlertTitle();
    if (!el) return;
    el.innerText = txt;
}

const setModalConfirmTitle = (txt: string) => {
    const el = getModalConfirmTitle();
    if (!el) return;
    el.innerText = txt;
}


const setModalPromptTitle = (txt: string) => {
    const el = getModalPromptTitle();
    if (!el) return;
    el.innerText = txt;
}

// -- focus buttons

const focusModalBtnConfirmCancel = () => {
    const btn = getModalBtnConfirmCancel();

    if (!btn) return;

    btn.focus();
};
const focusModalBtnConfirmSecondary = () => {
    const btn = getModalBtnConfirmSecondary();

    if (!btn) return;

    btn.focus();
};
const focusModalBtnConfirmPrimary = () => {
    const btn = getModalBtnConfirmPrimary();

    if (!btn) return;

    btn.focus();
};
const focusModalBtnAlertOK = () => {
    const btn = getModalBtnAlertOK();

    if (!btn) return;

    btn.focus();
};
const focusModalBtnPromptCancel = () => {
    const btn = getModalBtnPromptCancel();

    if (!btn) return;

    btn.focus();
};
const focusModalBtnPromptOK = () => {
    const btn = getModalBtnPromptOK();

    if (!btn) return;

    btn.focus();
};

// -- utility functions

/**
 * `replaceElement` provides a quick way to remove all event listeners from
 * e.g. a button. It clones the original element and removes the original
 * element and adds the newly cloned element to the original element's
 * parent's children. Note that the order of elements may not be fully
 * preserved, so be careful.
 */
const replaceElement = (el: HTMLElement | null): HTMLElement | null => {
    if (!el || !el.parentElement) return null;

    const nEl = el.cloneNode(true);

    el.parentElement.appendChild(nEl);
    el.parentElement.removeChild(el);

    const elem = document.getElementById(el.id);

    return elem;
}

/**
 * `replaceElementById` provides a quick way to remove all event listeners from
 * e.g. a button. It clones the original element (found by querying for `id`)
 * and removes the original element and adds the newly cloned element to
 * the original element's parent's children. Note that the order of elements
 * may not be fully preserved, so be careful.
 *
 * @param id The DOM ID corresponding to the element to be replaced.
 * @return {HTMLElement} The newly cloned element.
 */
const replaceElementById = (id: string): HTMLElement | null => {
    const el = document.getElementById(id);
    if (!el) return null;

    return replaceElement(el);
}

// -- targeted element manipulation functions

const replaceModalBtnConfirmCancel = () => replaceElement(getModalBtnConfirmCancel());
const replaceModalBtnConfirmSecondary = () => replaceElement(getModalBtnConfirmSecondary());
const replaceModalBtnConfirmPrimary = () => replaceElement(getModalBtnConfirmPrimary());
const replaceModalBtnAlertOK = () => replaceElement(getModalBtnAlertOK());
const replaceModalBtnPromptCancel = () => replaceElement(getModalBtnPromptCancel());
const replaceModalBtnPromptOK = () => replaceElement(getModalBtnPromptOK());

/** Resets the alert modal's text to an empty string. */
const resetModalAlertText = () => {
    const el = getModalAlertText();
    if (!el) return;
    el.innerText = '';
}

/** Resets the confirm modal's text to an empty string. */
const resetModalConfirmText = () => {
    const el = getModalConfirmText();
    if (!el) return;
    el.innerText = '';
}

/** Resets the alert modal's title text to an empty string. */
const resetModalAlertTitle = () => {
    const el = getModalAlertTitle();
    if (!el) return;
    el.innerText = '';
}

/** Resets the confirm modal's title text to an empty string. */
const resetModalConfirmTitle = () => {
    const el = getModalConfirmTitle();
    if (!el) return;
    el.innerText = '';
}

/** Resets the prompt modal's title text to an empty string. */
const resetModalPromptTitle = () => {
    const el = getModalPromptTitle();
    if (!el) return;
    el.innerText = '';
}

/** Removes the contents of the "prompt" modal's main content area. */
const resetModalPromptInput = () => {
    const el = getModalPromptInput();
    if (!el) return;
    el.replaceChildren('');
}

/** Hides the modal by setting a few classes. */
const hideModal = () => {
    const modal = getModal();
    if (!modal) return;

    modal.classList.remove(MODAL_CLASS_SHOW, MODAL_CLASS_OPEN);
    modal.classList.add(MODAL_CLASS_HIDE);
}

/** Shows the modal by setting a few classes. */
const showModal = () => {
    const modal = getModal();
    if (!modal) return;

    modal.classList.remove(MODAL_CLASS_HIDE);
    modal.classList.add(MODAL_CLASS_SHOW, MODAL_CLASS_OPEN);
}

/**
 * Hides all of the modal content bodies, and shows only the content
 * corresponding to the provided modal type, e.g. `alert` or `confirm`.
 *
 * @param {string} type e.g. the constant `MODAL_TYPE_ALERT`
 */
const setModalType = (type: string) => {
    const mp = getModalPromptContent();
    const mc = getModalConfirmContent()
    const ma = getModalAlertContent()
    hideElement(mp);
    hideElement(mc);
    hideElement(ma);

    switch (type) {
        case MODAL_TYPE_ALERT:
            showElement(ma);
            break;
        case MODAL_TYPE_CONFIRM:
            showElement(mc);
            break;
        case MODAL_TYPE_PROMPT:
            showElement(mp);
            break;
        default:
            return;
    }
}

/**
 * Sets the callbacks for the `clicked` event listener for each button, for the
 * Alert modal only. If changing this code, please preserve the order in which
 * the buttons are replaced via `replaceElement`.
 *
 * @param ok The callback to fire when clicking the OK button.
 */
const setModalAlertCallback = (ok: () => void): (HTMLElement | null)[] => {
    const okBtn = replaceModalBtnAlertOK();
    if (!okBtn) return [null];

    okBtn.addEventListener('click', ok);
    return [okBtn];
}

/**
 * Sets the callbacks for the `clicked` event listener for each button, for the
 * Confirm modal only. If changing this code, please preserve the order in which
 * the buttons are replaced via `replaceElement`.
 *
 * @param primary The callback to fire when clicking the primary button
 * @param secondary The callback to fire when clicking the secondary button
 * @param cancel The callback to fire when clicking the cancel button
 * @return Nullable Primary, secondary, and cancel button HTML elements inside
 * an array
 */
const setModalConfirmCallbacks = (primary: () => void, secondary: () => void, cancel: () => void): (HTMLElement | null)[] => {
    const cancelBtn = replaceElement(getModalBtnConfirmCancel());
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancel);
    }
    const secondaryBtn = replaceElement(getModalBtnConfirmSecondary());
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', secondary);
    }
    const primaryBtn = replaceElement(getModalBtnConfirmPrimary());
    if (primaryBtn) {
        primaryBtn.addEventListener('click', primary);
    }

    return [primaryBtn, secondaryBtn, cancelBtn];
}

/**
 * Sets the callbacks for the `clicked` event listener for each button, for the
 * Prompt modal only. If changing this code, please preserve the order in which
 * the buttons are replaced via `replaceElement`.
 *
 * @param ok The callback to fire when clicking the primary button
 * @param cancel The callback to fire when clicking the cancel button
 * @return Nullable OK and Cancel button HTML elements in an array
 */
const setModalPromptCallbacks = (ok: () => void, cancel: () => void): (HTMLElement | null)[] => {
    const cancelBtn = replaceElement(getModalBtnPromptCancel());
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancel);
    }
    const okBtn = replaceElement(getModalBtnPromptOK());
    if (okBtn) {
        okBtn.addEventListener('click', ok);
    }

    return [okBtn, cancelBtn];
}

/**
 * Shows a simple modal with the provided alert message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 */
export const showAlert = (msg: string, title: string) => {
    setModalType(MODAL_TYPE_ALERT);
    setModalAlertCallback(hideModal);
    setModalAlertText(msg);
    setModalAlertTitle(title);
    // scrollToTop();
    showModal();

    focusModalBtnAlertOK();
}

/**
 * Shows a confirm modal with the provided message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 * @return A promise containing `true`/`false` for yes/no, or `null` for cancel.
 */
export const showConfirm = async (msg: string, title: string): Promise<boolean | null> => {
    setModalType(MODAL_TYPE_CONFIRM);

    const promise = new Promise((resolve: (v: boolean | null) => void) => {
        setModalConfirmCallbacks(
            () => { hideModal(); return resolve(true); },
            () => { hideModal(); return resolve(false); },
            () => { hideModal(); return resolve(null); },
        );
    });

    setModalConfirmText(msg);
    setModalConfirmTitle(title);
    // scrollToTop();
    showModal();

    focusModalBtnConfirmCancel();

    return await promise;
}

/**
 * Shows a prompt modal with the provided message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param msg The message to show in the modal. Text-only for safety.
 * @param title The message to show in the modal. Text-only for safety.
 * @return A promise containing `true`/`false` for yes/no, or `null` for cancel.
 */
export const showPrompt = async (msg: string, title: string): Promise<string | null> => {
    setModalType(MODAL_TYPE_PROMPT);

    // replaceElement(getModalPromptText());
    const promptInput = replaceElement(getModalPromptInput());

    if (!promptInput) {
        throw 'Error: Prompt input field is not available.';
    }

    const promise = new Promise((resolve: (v: string | null) => void) => {
        const completed = () => { hideModal(); return resolve(getModalPromptInputText()); };

        promptInput?.addEventListener('keydown', (ev: KeyboardEvent) => {
            if (ev.key === 'Enter') {
                console.debug('yep');
                completed();
                ev.preventDefault();
                ev.stopImmediatePropagation();
            }
        })

        setModalPromptCallbacks(
            completed,
            () => { hideModal(); return resolve(null); },
        );
    });


    setModalPromptText(msg);
    setModalPromptTitle(title);
    setModalPromptInputText('');
    // scrollToTop();
    showModal();

    promptInput.focus();
    return await promise;
}
