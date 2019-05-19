import "../scss/style.scss";
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faUndoAlt,
  faRedoAlt,
  faPencilAlt,
  faICursor,
  faPlus,
  faTrashAlt,
  faSave
} from "@fortawesome/free-solid-svg-icons/";

const modalHtml = `
  <div class="it-modal__wrap">
    <div class="it-modal__wrap-backdrop"></div>
    <div class="it-modal">
      <div class="it-modal__header">
          Editar Imagem
      </div>
      <div class="it-modal__body">
        <div class="it-modal__actions">
          <button class="it-btn" id="btnDraw" title='Desenhar linha'><i class="fas fa-pencil-alt"></i></button>
          <div class="it-dropdown it-no-hover">
            <button class="it-btn" id="btnText" title='Adicionar texto'>
              <i class="fas fa-i-cursor"></i>
            </button>
            <div class="it-dropdown-content">
              <div class="it-input-group">
                <input placeholder='Adicionar texto...' id="textAddValue"/>
                <a href="javascript:void(0);" id="addText"><i class="fas fa-plus"></i></a>
              </div>
            </div>
          </div>
          <div class="it-dropdown" id="dropDownColor"> 
            <button class="it-btn" id="btnColor" title='Escolher cor'>
              <span class='it-color it-color--darkblue selected'></span> 
            </button>
            <div class="it-dropdown-content">
              <a href="javascript:void(0)" data-color='darkgreen'>
                <span class='it-color it-color--darkgreen'></span>  
              </a>
              <a href="javascript:void(0)" data-color='yellow'>
                <span class='it-color it-color--yellow'></span>
              </a>
              <a href="javascript:void(0)" data-color='darkblue'>
                <span class='it-color it-color--darkblue'></span>
              </a>
              <a href="javascript:void(0)" data-color='darkred'>
                <span class='it-color it-color--darkred'></span>
              </a>
              <a href="javascript:void(0)" data-color='black'>
                <span class='it-color it-color--black'></span>
              </a>
            </div> 
          </div>
          <div class="it-dropdown" id="dropdownLine"> 
            <button class="it-btn" id="btnLine" title='Tamanho da linha'>
              <span class='it-line it-line--normal selected'></span> 
            </button>
            <div class="it-dropdown-content">
              <a href="javascript:void(0)" data-line='small'>
                <span class='it-line it-line--small'></span>  
              </a>
              <a href="javascript:void(0)" data-line='normal'>
                <span class='it-line it-line--normal'></span>
              </a>
              <a href="javascript:void(0)" data-line='large'>
                <span class='it-line it-line--large'></span>
              </a>
            </div> 
          </div>
          <div class="it-divisor"></div>
          <button class="it-btn" id="btnUndo"><i class="fas fa-undo-alt"></i></button>
          <button class="it-btn" id="btnRedo"><i class="fas fa-redo-alt"></i></button>
          <button class="it-btn" id="btnReset" title='Limpar'><i class="fas fa-trash-alt"></i></button>
        </div>
        <div class="it-modal__canvas">
          <canvas/>
        </div>
        <div class='it-modal__footer'>
          <button class="it-btn it-btn-cancel" id="btnCancel" title='Limpar'> Cancelar</button>
          <button class="it-btn it-btn-save" id="btnSave" title='Limpar'><i class="fas fa-save"></i> Salvar</button>
        </div>
      </div>
    </div>
  </div>
`;

function createModal() {
  let elModal = new DOMParser().parseFromString(modalHtml, "text/html").body
    .firstChild;
  let elCanvas = elModal.getElementsByTagName("canvas")[0];
  document.body.appendChild(elModal);

  return { elModal, elCanvas };
}

function configIcons() {
  library.add(
    faUndoAlt,
    faRedoAlt,
    faPencilAlt,
    faICursor,
    faPlus,
    faTrashAlt,
    faSave
  );
  dom.watch();
}

export function initUI() {
  configIcons();
  let { elModal, elCanvas } = createModal();
  return { elModal, elCanvas };
}
