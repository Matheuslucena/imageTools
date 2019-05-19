import canvasUtils from "../utils/canvasUtils";
import drawTools from "./drawTool";
import undoRedo from "./undoRedo";

let startX = null;
let startY = null;
let selectedText = -1;
let texts = new Array();

function addText(text, canvas) {
  const ctx = canvas.getContext("2d");
  let objText = {
    text: text,
    x: null,
    y: null,
    width: ctx.measureText(text.text).width,
    height: 16
  };
  texts.push(objText);
  _drawTexts(canvas);
  undoRedo.cache(texts.length - 1, 1, "text");
}

function mousedownHandler(event, canvas) {
  let { left, top } = event.currentTarget.getBoundingClientRect();
  let mouseX = event.pageX - left;
  let mouseY = event.pageY - top;

  for (var i = 0; i < texts.length; i++) {
    if (_textHitTest(mouseX, mouseY, i)) {
      startX = mouseX;
      startY = mouseY;
      selectedText = i;
    }
  }
}

function mousemoveHandler(event, canvas, drawingActive, img) {
  if (selectedText < 0 || drawingActive) {
    return;
  }

  canvasUtils.setCanvasCursor(canvas, "pointer");
  let { left, top } = event.currentTarget.getBoundingClientRect();

  let mouseX = parseInt(event.clientX - left);
  let mouseY = parseInt(event.clientY - top);

  var dx = mouseX - startX;
  var dy = mouseY - startY;
  startX = mouseX;
  startY = mouseY;

  var text = texts[selectedText];
  text.x += dx;
  text.y += dy;

  _drawTexts(canvas, img);
}

function mouseupHandler(event, canvas) {
  if (selectedText >= 0) canvasUtils.setCanvasCursor(canvas, "default");
  selectedText = -1;
}

function reset() {
  startX = null;
  startY = null;
  selectedText = -1;
  texts = new Array();
}

function _drawTexts(canvas, img) {
  const ctx = canvas.getContext("2d");

  if (texts.length > 0 && img) {
    canvasUtils.drawImage(canvas, img);
    drawTools.drawLines(canvas);
  }

  for (var i = 0; i < texts.length; i++) {
    var text = texts[i];
    text.x = text.x === null ? 20 : text.x;
    text.y = text.y === null ? 20 * (i + 1) : text.y;
    ctx.fillText(text.text, text.x, text.y);
  }
}

function _textHitTest(x, y, idx) {
  var text = texts[idx];
  return (
    x >= text.x &&
    x <= text.x + text.width &&
    y >= text.y - text.height &&
    y <= text.y
  );
}

function undo(start, itens, canvas) {
  let removed = { text: texts.splice(start, 1)[0] };
  _drawTexts(canvas);

  return removed;
}

function redo(item, canvas) {
  texts.push(item.text);
  _drawTexts(canvas);
}

export default {
  addText,
  mousedownHandler,
  mousemoveHandler,
  mouseupHandler,
  reset,
  drawTexts: _drawTexts,
  undo,
  redo
};
