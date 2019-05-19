import "babel-polyfill";
import { reject } from "q";
import canvasUtils from "../utils/canvasUtils";
import drawTool from "./drawTool";
import textTool from "./textTool";
import undoRedo from "./undoRedo";

class ImageTools {
  constructor(elModal, elCanvas) {
    this.modal = elModal;
    this.canvas = elCanvas;

    this.image = null;
    this.originalSrc = null;
    this.onSave = null;

    this.drawingActive = false;
  }

  edit(options) {
    this.originalSrc = options.src;
    this.onSave = options.onSave;

    this._init();
  }

  openModal() {
    this.modal.classList.add("open");
  }

  closeModal() {
    this.modal.classList.remove("open");
  }

  async _init() {
    try {
      await this._loadImage(this.originalSrc);
      this._resetCanvas();
      this._initCanvasEvents();
      this._initActionsEvents();
      this.openModal();
    } catch (e) {
      console.error(e);
    }
  }

  _loadImage(src) {
    return new Promise((resolve, resject) => {
      this.image = new Image();
      this.image.onload = () => {
        resolve(this.image);
      };
      this.image.onerror = () => {
        reject("Error on loading image");
      };
      this.image.src = src;
    });
  }

  _initCanvasEvents() {
    this.canvas.addEventListener("mousedown", e => {
      if (this.drawingActive) {
        drawTool.mousedownHandler(e, this.canvas);
      }
      textTool.mousedownHandler(e, this.canvas);
    });

    this.canvas.addEventListener("mousemove", e => {
      if (this.drawingActive) {
        drawTool.mousemoveHandler(e, this.canvas);
      }
      textTool.mousemoveHandler(e, this.canvas, this.drawingActive, this.image);
    });

    this.canvas.addEventListener("mouseup", e => {
      if (this.drawingActive) {
        drawTool.mouseupHandler(e, this.canvas);
      }
      textTool.mouseupHandler(e, this.canvas);
    });
  }

  _initActionsEvents() {
    let {
      btnDraw,
      btnReset,
      btnText,
      btnAddText,
      btnSave,
      btnUndo,
      btnRedo,
      btnCancel,
      btnsLine,
      btnsColor
    } = this._getActionsButtons();

    btnDraw.addEventListener("click", e => {
      this._resetTextBtn(btnText);
      e.currentTarget.classList.toggle("active");
      this.drawingActive = !this.drawingActive;
      canvasUtils.setCanvasCursor(
        this.canvas,
        this.drawingActive ? "crosshair" : "default"
      );
    });

    btnText.addEventListener("click", e => {
      this._resetDrawBtn(btnDraw);
      e.currentTarget.parentNode.classList.toggle("open");
      e.currentTarget.parentNode.querySelector("input").focus();
    });

    btnAddText.addEventListener("click", e => {
      let text = this.modal.querySelector("#textAddValue").value;
      if (text && text != "") {
        textTool.addText(text, this.canvas);
        this._resetTextBtn(btnText);
      }
    });

    for (let j = 0; j < btnsColor.length; j++) {
      let button = btnsColor[j];
      button.addEventListener("click", e => {
        let currentColor = e.currentTarget.dataset.color;
        let colorSelected = this.modal.querySelector("#btnColor span");
        colorSelected.className = `it-color it-color--${currentColor} selected`;
        drawTool.setColor(currentColor);
      });
    }

    for (let j = 0; j < btnsLine.length; j++) {
      let button = btnsLine[j];
      button.addEventListener("click", e => {
        let currentLine = e.currentTarget.dataset.line;
        let lineSelected = this.modal.querySelector("#btnLine span");
        lineSelected.className = `it-line it-line--${currentLine} selected`;
        drawTool.setLine(currentLine);
      });
    }

    btnUndo.addEventListener("click", e => {
      this._resetCanvas();
      undoRedo.undo(this.canvas);
    });

    btnRedo.addEventListener("click", e => {
      undoRedo.redo(this.canvas);
    });

    btnReset.addEventListener("click", e => {
      this._resetCanvas();
      drawTool.reset();
      textTool.reset();
      undoRedo.clear();
    });

    btnSave.addEventListener("click", e => {
      this.onSave(canvasUtils.canvasToDataURL(this.canvas));
    });

    btnCancel.addEventListener("click", e => {
      this.closeModal();
    });
  }

  _getActionsButtons() {
    return {
      btnDraw: this.modal.querySelector("#btnDraw"),
      btnReset: this.modal.querySelector("#btnReset"),
      btnText: this.modal.querySelector("#btnText"),
      btnAddText: this.modal.querySelector("#addText"),
      btnSave: this.modal.querySelector("#btnSave"),
      btnUndo: this.modal.querySelector("#btnUndo"),
      btnRedo: this.modal.querySelector("#btnRedo"),
      btnCancel: this.modal.querySelector("#btnCancel"),
      btnsLine: this.modal.querySelectorAll(
        "#dropdownLine .it-dropdown-content a"
      ),
      btnsColor: this.modal.querySelectorAll(
        "#dropDownColor .it-dropdown-content a"
      )
    };
  }

  _resetCanvas() {
    canvasUtils.drawImage(this.canvas, this.image);
  }

  _resetDrawBtn(btnDraw) {
    btnDraw.classList.remove("active");
    canvasUtils.setCanvasCursor(this.canvas);
    this.drawingActive = false;
  }

  _resetTextBtn(btnText) {
    btnText.parentNode.classList.remove("open");
    this.modal.querySelector("#textAddValue").value;
  }
}

export default ImageTools;
