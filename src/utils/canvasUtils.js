function drawImage(canvas, image) {
  const ctx = canvas.getContext("2d");
  //Clear the canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let w = (canvas.width = image.naturalWidth || image.width);
  let h = (canvas.height = image.naturalHeight || image.height);

  ctx.font = "16px verdana";
  ctx.save();
  ctx.drawImage(image, 0, 0, w, h);
  ctx.restore();
}

function setCanvasCursor(canvas, cursor = "default") {
  canvas.style.cursor = cursor;
}

function canvasToDataURL(canvas, quality = 1) {
  return canvas.toDataURL("image/png", quality);
}

export default {
  drawImage,
  setCanvasCursor,
  canvasToDataURL
};
