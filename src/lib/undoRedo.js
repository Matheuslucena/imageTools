import drawTool from "./drawTool";
import textTool from "./textTool";

let _cache = [];
let _undo = [];

const undoRedo = {
  undo: canvas => {
    const cache = _cache.pop();
    if (cache) {
      if (cache.type === "draw") {
        _undo.push({
          ...drawTool.undo(cache.start, cache.itens, canvas),
          type: cache.type,
          start: cache.start,
          itens: cache.itens
        });
        textTool.drawTexts(canvas);
      } else if (cache.type === "text") {
        _undo.push({
          ...textTool.undo(cache.start, cache.itens, canvas),
          type: cache.type,
          start: cache.start,
          itens: cache.itens
        });
        drawTool.drawLines(canvas);
      }
    }
  },
  redo: canvas => {
    const undo = _undo.pop();
    if (undo) {
      let { start, itens, type } = undo;
      if (undo.type === "draw") {
        drawTool.redo(undo, canvas);
      } else if (undo.type === "text") {
        textTool.redo(undo, canvas);
      }

      _cache.push({ start, itens, type });
    }
  },
  cache: (idxStart, idxEnd, type) => {
    let itens = idxEnd - idxStart + 1;
    _cache.push({ start: idxStart, itens, type });
    _undo = [];
  },
  clear: () => {
    _cache = [];
    _undo = [];
  }
};

Object.freeze(undoRedo);
export default undoRedo;
