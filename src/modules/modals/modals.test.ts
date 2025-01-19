import { CLASS_ELEMENT_HIDE, CLASS_ELEMENT_SHOW } from '../classes';
import {
  getModal,
  getModalBtnConfirmCancel,
  getModalBtnConfirmSecondary,
  getModalBtnConfirmPrimary,
  getModalBtnAlertOK,
  getModalBtnPromptCancel,
  getModalBtnPromptOK,
  getModalAlertContent,
  getModalConfirmContent,
  getModalPromptContent,
  getModalAlertText,
  getModalConfirmText,
  getModalPromptText,
  getModalAlertTitle,
  getModalConfirmTitle,
  getModalPromptTitle,
  getModalPromptInputText,
  hideModal,
  ModalState,
  showModal,
  setModalType,
  ModalType,
} from './modals';

describe('modals', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('has functions to get various dom elements', async () => {
    document.body.innerHTML = `<div id="modal">1</div>
<button id="btnModalConfirmCancel">2</button>
<button id="btnModalConfirmSecondary">3</button>
<button id="btnModalConfirmPrimary">4</button>
<button id="btnModalAlertOK">5</button>
<button id="btnModalPromptCancel">6</button>
<button id="btnModalPromptOK">7</button>
<div id="modalAlertContent">8</div>
<div id="modalConfirmContent">9</div>
<div id="modalPromptContent">10</div>
<span id="modalAlertText">11</span>
<span id="modalConfirmText">12</span>
<span id="modalPromptText">13</span>
<input id="modalPromptInput" value="14"></input>
<heading id="modalAlertTitle">15</heading>
<heading id="modalConfirmTitle">16</heading>
<heading id="modalPromptTitle">17</heading>`;

    expect(getModal()?.innerHTML).toBe('1');
    expect(getModalBtnConfirmCancel()?.innerHTML).toBe('2');
    expect(getModalBtnConfirmSecondary()?.innerHTML).toBe('3');
    expect(getModalBtnConfirmPrimary()?.innerHTML).toBe('4');
    expect(getModalBtnAlertOK()?.innerHTML).toBe('5');
    expect(getModalBtnPromptCancel()?.innerHTML).toBe('6');
    expect(getModalBtnPromptOK()?.innerHTML).toBe('7');
    expect(getModalAlertContent()?.innerHTML).toBe('8');
    expect(getModalConfirmContent()?.innerHTML).toBe('9');
    expect(getModalPromptContent()?.innerHTML).toBe('10');
    expect(getModalAlertText()?.innerHTML).toBe('11');
    expect(getModalConfirmText()?.innerHTML).toBe('12');
    expect(getModalPromptText()?.innerHTML).toBe('13');
    expect(getModalPromptInputText()).toBe('14');
    expect(getModalAlertTitle()?.innerHTML).toBe('15');
    expect(getModalConfirmTitle()?.innerHTML).toBe('16');
    expect(getModalPromptTitle()?.innerHTML).toBe('17');
  });

  it('shows and hides', async () => {
    document.body.innerHTML = `<div id="modal" class="">1</div>`;
    expect(getModal()?.innerHTML).toBe('1');
    expect(getModal()?.className).toBe('');
    hideModal();
    expect(getModal()?.className).toBe(ModalState.Hide);
    showModal();
    expect(getModal()?.className).toBe(`${ModalState.Show} ${ModalState.Open}`);
  });

  it('gracefully attempts to show and hide when no modal is present', async () => {
    document.body.innerHTML = `<div id="notTheModal" class="">1</div>`;
    expect(getModal()).toBe(null);
    hideModal();
    showModal();
  });

  it('can have its type set', async () => {
    document.body.innerHTML = `<div id="modal" class="">1</div>
<div id="modalPromptContent" class="">2</div>
<div id="modalConfirmContent" class="">3</div>
<div id="modalAlertContent" class="">4</div>
`;

    const modal = getModal();
    const modalPromptContent = getModalPromptContent();
    const modalConfirmContent = getModalConfirmContent();
    const modalAlertContent = getModalAlertContent();

    expect(modal?.innerHTML).toBe('1');
    expect(modalPromptContent?.innerHTML).toBe('2');
    expect(modalConfirmContent?.innerHTML).toBe('3');
    expect(modalAlertContent?.innerHTML).toBe('4');

    setModalType(ModalType.Alert);
    expect(modalPromptContent?.className).toBe(CLASS_ELEMENT_HIDE);
    expect(modalConfirmContent?.className).toBe(CLASS_ELEMENT_HIDE);
    expect(modalAlertContent?.className).toBe(CLASS_ELEMENT_SHOW);

    setModalType(ModalType.Confirm);
    expect(modalPromptContent?.className).toBe(CLASS_ELEMENT_HIDE);
    expect(modalConfirmContent?.className).toBe(CLASS_ELEMENT_SHOW);
    expect(modalAlertContent?.className).toBe(CLASS_ELEMENT_HIDE);

    setModalType(ModalType.Prompt);
    expect(modalPromptContent?.className).toBe(CLASS_ELEMENT_SHOW);
    expect(modalConfirmContent?.className).toBe(CLASS_ELEMENT_HIDE);
    expect(modalAlertContent?.className).toBe(CLASS_ELEMENT_HIDE);
  });
});
