// -- constants

import { hideElement, showElement } from "./helpers";

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

// dynamic modal prompt body
export const MODAL_PROMPT_BODY = 'modalPromptBody';

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

// dynamic modal prompt body
const getModalPromptBody = () => document.getElementById(MODAL_PROMPT_BODY);

// modal titles
const getModalAlertTitle = () => document.getElementById(MODAL_ALERT_TITLE);
const getModalConfirmTitle = () => document.getElementById(MODAL_CONFIRM_TITLE);
const getModalPromptTitle = () => document.getElementById(MODAL_PROMPT_TITLE);

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

/**
 * Sets the `innerHTML` of the modal prompt's body.
 */
const setModalPromptBody = (html: string) => {
    const el = getModalPromptBody();
    if (!el) return;
    el.innerHTML = html;
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

// -- utility functions

/**
 * `replaceElement` provides a quick way to remove all event listeners from
 * e.g. a button. It clones the original element and removes the original
 * element and adds the newly cloned element to the original element's
 * parent's children. Note that the order of elements may not be fully
 * preserved, so be careful.
 */
const replaceElement = (el: HTMLElement | null) => {
    if (!el || !el.parentElement) return;

    const nEl = el.cloneNode(true);

    el.parentElement.appendChild(nEl);
    el.parentElement.removeChild(el);

    return nEl;
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
const replaceElementById = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

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
const resetModalPromptBody = () => {
    const el = getModalPromptBody();
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
 * @param primary The callback to fire when clicking the primary button
 * @param secondary The callback to fire when clicking the secondary button
 * @param cancel The callback to fire when clicking the cancel button
 * @return {HTMLElement[]} OK button HTML element as a single-valued array
 */
const setModalAlertCallback = (ok: any) => {
    const okBtn = replaceElement(getModalBtnAlertOK());
    if (okBtn) {
        okBtn.addEventListener('click', ok);
    }

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
 * @return {HTMLElement[]} Primary, secondary, and cancel button HTML elements
 */
const setModalConfirmCallbacks = (primary: any, secondary: any, cancel: any) => {
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
 * @return {HTMLElement[]} OK and Cancel button HTML elements
 */
const setModalPromptCallbacks = (ok: any, cancel: any) => {
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

// --

// /**
//  * Completely resets the content of the modal, which means
//  * that the alert, confirm, and prompt contents will be
//  * reset and hidden, in addition to the modal itself.
//  */
// const resetModal = () => {
//     const alertContent = getModalAlertContent();
//     const confirmContent = getModalConfirmContent();
//     const promptContent = getModalPromptContent();
//     hideElement(alertContent);
//     hideElement(confirmContent);
//     hideElement(promptContent);
// }

// export const hideAlertEvent = (event) => {
//     hideAlert();
// }

// export const hideAlert = () => {
//     const modal = document.getElementById(MODAL_ID);
//     modal.classList.remove(MODAL_CLASS_SHOW);
//     modal.classList.add(MODAL_CLASS_HIDE);
//     const modalText = document.getElementById(MODAL_BODY_TEXT_ID);
//     modalText.innerText = '';
//     const modalTitle = document.getElementById(MODAL_TITLE_TEXT_ID);
//     modalTitle.innerText = '';
// }

// export const hideAllModalContent = () => {
//     hideElement(document.getElementById(MODAL_ALERT_CONTENT));
//     hideElement(document.getElementById(MODAL_CONFIRM_CONTENT));
//     hideElement(document.getElementById(MODAL_PROMPT_CONTENT));
// }

/**
 * Shows a simple modal with the provided alert message. Clears out any
 * existing event handlers for the primary & secondary input buttons.
 *
 * @param {string} msg The message to show in the modal. Text-only for safety.
 * @param {string} title The message to show in the modal. Text-only for safety.
 */
export const showAlert = (msg: any, title: any) => {
    setModalType(MODAL_TYPE_ALERT);
    setModalAlertCallback(hideElement);
    setModalAlertText(msg);
    setModalAlertTitle(title);
    showModal();

    // const txt = document.getElementById(MODAL_BODY_TEXT_ID);
    // const titleElement = document.getElementById(MODAL_TITLE_TEXT_ID);
    // const btnModalAlertOK = document.getElementById(MODAL_BTN_PRIMARY);
    // const modal = document.getElementById(MODAL_ID);

    // if (!txt || !titleElement || !btnModalAlertOK) {
    //     console.debug('missing element by id for show alert modal');
    //     return
    // }

    // hideAllModalContent();

    // txt.innerText = msg;
    // titleElement.innerText = title;

    // // remove all existing event listeners from both primary and secondary
    // // buttons
    // const newBtnModalAlertOK = btnModalAlertOK.cloneNode(true);
    // btnModalAlertOK.parentNode.appendChild(newBtnModalAlertOK);
    // btnModalAlertOK.parentNode.removeChild(btnModalAlertOK);

    // hideModal();

    // newBtnModalAlertOK.addEventListener('click', hideAlertEvent);

    // showElement(document.getElementById(MODAL_ALERT_CONTENT));
}