import { BaseComponent } from "../../component.js";
import { TextData } from "../dialog.js"

export class TextSectionInput extends BaseComponent<HTMLElement> implements TextData {
  constructor () {
    super(`
    <form class="modal-input-area">
      <label for="title">Title</label>
      <input type="text" id="title">
      <label for="body">Body</label>
      <textarea type="text" row="3" id="body"></textarea>
    </form>`)

  }
  get title():string {
    const element = this.element.querySelector('#title')! as HTMLInputElement;
    return element.value;
  }
  get body():string {
    const element = this.element.querySelector('#body')! as HTMLInputElement;
    return element.value;
  }
}