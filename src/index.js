import { initUI } from "./lib/ui";
import ImageTools from "./lib/ImageTools";

function init() {
  //Create the UI
  let { elModal, elCanvas } = initUI();

  //Instantiate a new ImageTools with the UI created
  return new ImageTools(elModal, elCanvas);
}

export default init();
