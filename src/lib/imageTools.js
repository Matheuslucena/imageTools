import UI from "./ui";

class ImageTools {
  constructor() {
    const ui = new UI();
    ui.createModal();
    this.originalImg = null;
    this.modalUI = ui.modalElement;
    this.canvas = ui.canvasElement;
    this.paint = false;
    this.clickX = new Array();
    this.clickY = new Array();
    this.clickDrag = new Array();
    this.ctx = null;
    this.saveCb = null;

    this.texts = new Array();
    this.clickColor = new Array();
    this.currentColor = "darkblue";

    this.clickLine = new Array();
    this.currentLine = "normal";

    this.drawingActive = false;
    this.selectedText = -1;
  }

  init(options) {
    this.originalImg = options.src;
    this.saveCb = options.saveCb;
    this.loadImg();
    this.drawEvents();
    this.actionsEvents();
    this._selectColor();
    this._selectLine();
  }

  open() {
    this.modalUI.classList.add("open");
  }

  close() {
    this.modalUI.classList.remove("open");
  }

  loadImg() {
    this.img = new Image();
    this.img.onload = () => {
      this._clear();
      this._drawImg(this.img);
    };
    this.img.src = this.originalImg;
  }

  drawEvents() {
    this.canvas.addEventListener("mousedown", e => {
      let { left, top } = e.currentTarget.getBoundingClientRect();
      let mouseX = e.pageX - left;
      let mouseY = e.pageY - top;

      this.paint = true;
      this._addClick(mouseX, mouseY);
      for (var i = 0; i < this.texts.length; i++) {
        if (this._textHitTest(mouseX, mouseY, i)) {
          this.canvas.style.cursor = "pointer";
          this.startX = mouseX;
          this.startY = mouseY;
          this.selectedText = i;
        }
      }

      this._redraw();
    });

    this.canvas.addEventListener("mousemove", e => {
      if (this.paint) {
        let { left, top } = e.currentTarget.getBoundingClientRect();
        this._addClick(e.pageX - left, e.pageY - top, true);
        this._handleMouseMove(e);
        this._redraw();
      }
    });

    this.canvas.addEventListener("mouseup", e => {
      this.paint = false;
      this.selectedText = -1;
      this.canvas.style.cursor = "default";
    });
  }

  actionsEvents() {
    let btnDraw = this.modalUI.querySelector("#btnDraw");
    btnDraw.addEventListener("click", e => {
      this.drawingActive = !this.drawingActive;
      e.currentTarget.classList.toggle("active");
      if (this.drawingActive) this.canvas.style.cursor = "crosshair";
    });

    let btnReset = this.modalUI.querySelector("#btnReset");
    btnReset.addEventListener("click", e => {
      this._clear();
      this._drawImg(this.img);
    });

    // let btnUndo = this.modalUI.querySelector("#btnUndo");
    // btnUndo.addEventListener("click", e => {
    //   this._undo();
    // });

    let btnText = this.modalUI.querySelector("#btnText");
    btnText.addEventListener("click", e => {
      btnDraw.classList.remove("active");
      this.drawingActive = false;
      e.currentTarget.parentNode.classList.toggle("open");
    });

    let btnAddText = this.modalUI.querySelector("#addText");
    btnAddText.addEventListener("click", e => {
      let text = this.modalUI.querySelector("#textAddValue").value;
      if (text && text != "") {
        btnDraw.classList.remove("active");
        this._addText(text);
      }
      btnText.parentNode.classList.toggle("open");
    });

    let btnSave = this.modalUI.querySelector("#btnSave");
    btnSave.addEventListener("click", e => {
      if (typeof this.saveCb == "function") {
        this.saveCb(this._canvasToDataURL(this.canvas, 1));
        this.close();
      }
    });

    let btnCancel = this.modalUI.querySelector("#btnCancel");
    btnCancel.addEventListener("click", e => {
      this.close();
    });
  }

  _addClick(x, y, dragging) {
    if (this.drawingActive) {
      this.clickX.push(x);
      this.clickY.push(y);
      this.clickDrag.push(dragging);
      this.clickColor.push(this.currentColor);
      this.clickLine.push(this.currentLine);
    }
  }

  _addText(text) {
    let objText = {
      text: text,
      x: null,
      y: null,
      width: this.ctx.measureText(text.text).width,
      height: 16
    };
    this.texts.push(objText);
    this.drawingActive = false;
    this._redraw();
  }

  _redraw() {
    let lineWidth = 5;
    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas
    if (this.drawingActive) {
      this._drawLines();
    }
    if (this.texts.length > 0 && !this.drawingActive) {
      this._drawImg(this.img);
      this._drawLines();
    }

    for (var i = 0; i < this.texts.length; i++) {
      var text = this.texts[i];
      text.x = text.x === null ? 20 : text.x;
      text.y = text.y === null ? 20 * (i + 1) : text.y;
      this.ctx.fillText(text.text, text.x, text.y);
    }
  }

  _drawImg(img) {
    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    let w = (this.canvas.width = img.naturalWidth || img.width);
    let h = (this.canvas.height = img.naturalHeight || img.height);

    this.ctx.font = "16px verdana";
    this.ctx.save();
    this.ctx.drawImage(img, 0, 0, w, h);
    this.ctx.restore();
  }

  _selectColor() {
    let btnsColor = this.modalUI.querySelectorAll(
      "#dropDownColor .it-dropdown-content a"
    );
    for (let j = 0; j < btnsColor.length; j++) {
      let button = btnsColor[j];
      button.addEventListener("click", e => {
        this.currentColor = e.currentTarget.dataset.color;
        let colorSelected = this.modalUI.querySelector("#btnColor span");
        colorSelected.className = `it-color it-color--${
          this.currentColor
        } selected`;
      });
    }
  }

  _selectLine() {
    let btnsLine = this.modalUI.querySelectorAll(
      "#dropdownLine .it-dropdown-content a"
    );
    for (let j = 0; j < btnsLine.length; j++) {
      let button = btnsLine[j];
      button.addEventListener("click", e => {
        this.currentLine = e.currentTarget.dataset.line;
        let lineSelected = this.modalUI.querySelector("#btnLine span");
        lineSelected.className = `it-line it-line--${
          this.currentLine
        } selected`;
      });
    }
  }

  _textHitTest(x, y, idx) {
    var text = this.texts[idx];
    return (
      x >= text.x &&
      x <= text.x + text.width &&
      y >= text.y - text.height &&
      y <= text.y
    );
  }

  _handleMouseMove(e) {
    if (this.selectedText < 0 || this.drawingActive) {
      return;
    }

    let { left, top } = e.currentTarget.getBoundingClientRect();

    let mouseX = parseInt(e.clientX - left);
    let mouseY = parseInt(e.clientY - top);

    // Put your mousemove stuff here
    var dx = mouseX - this.startX;
    var dy = mouseY - this.startY;
    this.startX = mouseX;
    this.startY = mouseY;

    var text = this.texts[this.selectedText];
    text.x += dx;
    text.y += dy;
  }

  _drawLines() {
    let lineWidth = 5;
    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas
    // this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineJoin = "round";
    // this.ctx.lineWidth = 5;
    for (var i = 0; i < this.clickX.length; i++) {
      this.ctx.beginPath();
      if (this.clickDrag[i] && i) {
        this.ctx.moveTo(this.clickX[i - 1], this.clickY[i - 1]);
      } else {
        this.ctx.moveTo(this.clickX[i] - 1, this.clickY[i]);
      }
      this.ctx.lineTo(this.clickX[i], this.clickY[i]);
      this.ctx.closePath();
      this.ctx.strokeStyle = this.clickColor[i];

      switch (this.clickLine[i]) {
        case "small":
          lineWidth = 2;
          break;
        case "normal":
          lineWidth = 5;
          break;
        case "large":
          lineWidth = 10;
          break;
        default:
          break;
      }

      this.ctx.lineWidth = lineWidth;
      this.ctx.stroke();
    }
  }

  _clear() {
    this.paint = false;
    this.clickX = new Array();
    this.clickY = new Array();
    this.clickDrag = new Array();
    this.clickColor = new Array();
    this.clickLine = new Array();
    this.texts = new Array();
  }

  _canvasToDataURL(canvas, quality) {
    return canvas.toDataURL("image/png", quality);
  }

  // _undo() {
  //   this.clickX.pop();
  //   this.clickY.pop();
  //   this.clickDrag.pop();
  //   this._redraw();
  // }
}

export default ImageTools;
