import { BaseComponent } from "../../component.js";
import { MediaData } from "../dialog.js"

export class MediaSectionInput extends BaseComponent<HTMLElement> implements MediaData {
  constructor () {
    super(`
    <form class="modal-input-area">
      <label for="title">Title</label>
      <input type="text" id="title">
      <label for="url">URL</label>
      <input type="text" id="url">
    </form>`)

  }
  get title():string {
    const element = this.element.querySelector('#title')! as HTMLInputElement;
    return element.value;
  }
  get url():string {
    const element = this.element.querySelector('#url')! as HTMLInputElement;
    return element.value;
  }
}