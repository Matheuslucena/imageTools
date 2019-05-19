import undoRedo from "./undoRedo";

let paint = false;
let clickX = new Array();
let clickY = new Array();
let clickDrag = new Array();
let clickColor = new Array();
let clickLine = new Array();
let currentColor = "darkblue";
let currentLine = "normal";
let idxStart = null;
let idxEnd = null;

function mousedownHandler(event, canvas) {
  paint = true;
  let { left, top } = event.currentTarget.getBoundingClientRect();
  let mouseX = event.pageX - left;
  let mouseY = event.pageY - top;
  _addClick(mouseX, mouseY);
  _drawLines(canvas);
  idxStart = clickX.length - 1;
}

function mousemoveHandler(event, canvas) {
  if (paint) {
    let { left, top } = event.currentTarget.getBoundingClientRect();
    let mouseX = event.pageX - left;
    let mouseY = event.pageY - top;
    _addClick(mouseX, mouseY, true);
    _drawLines(canvas);
  }
}

function mouseupHandler(event) {
  paint = false;
  idxEnd = clickX.length - 1;
  undoRedo.cache(idxStart, idxEnd, "draw");
  idxStart = idxEnd = null;
}

function reset() {
  paint = false;
  clickX = new Array();
  clickY = new Array();
  clickDrag = new Array();
  clickColor = new Array();
  clickLine = new Array();
}

function setLine(lineWidth) {
  currentLine = lineWidth;
}

function setColor(color) {
  currentColor = color;
}

function _addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
  clickColor.push(currentColor);
  clickLine.push(currentLine);
}

function _drawLines(canvas) {
  const ctx = canvas.getContext("2d");
  let lineWidth = 5;

  ctx.lineJoin = "round";

  for (var i = 0; i < clickX.length; i++) {
    ctx.beginPath();
    if (clickDrag[i] && i) {
      ctx.moveTo(clickX[i - 1], clickY[i - 1]);
    } else {
      ctx.moveTo(clickX[i] - 1, clickY[i]);
    }
    ctx.lineTo(clickX[i], clickY[i]);
    ctx.closePath();
    ctx.strokeStyle = clickColor[i];

    switch (clickLine[i]) {
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

    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function undo(start, itens, canvas) {
  let removed = {
    clickX: clickX.splice(start, itens),
    clickY: clickY.splice(start, itens),
    clickDrag: clickDrag.splice(start, itens),
    clickColor: clickColor.splice(start, itens),
    clickLine: clickLine.splice(start, itens)
  };
  _drawLines(canvas);

  return removed;
}

function redo(item, canvas) {
  clickX.push(...item.clickX);
  clickY.push(...item.clickY);
  clickDrag.push(...item.clickDrag);
  clickColor.push(...item.clickColor);
  clickLine.push(...item.clickLine);

  _drawLines(canvas);
}

export default {
  mousedownHandler,
  mousemoveHandler,
  mouseupHandler,
  reset,
  setLine,
  setColor,
  drawLines: _drawLines,
  undo,
  redo
};
