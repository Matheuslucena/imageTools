import "./scss/style.scss";
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
import ImageTools from "./lib/imageTools";

library.add(faUndoAlt);
library.add(faRedoAlt);
library.add(faPencilAlt);
library.add(faICursor);
library.add(faPlus);
library.add(faTrashAlt);
library.add(faSave);
dom.watch();

export default ImageTools;
