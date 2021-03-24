import { BaseComponent, Component } from "../component.js"
import { Composable } from '../page/page.js'

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export interface MediaData {
  readonly title: string;
  readonly url: string;
}

export interface TextData {
  readonly title: string;
  readonly body: string;
}

export class InputDialog extends BaseComponent<HTMLElement> implements Composable {
  closeListener?: OnCloseListener;
  submitListener? : OnSubmitListener;
  constructor() {
    super(`<div class="modal-popup-background">
            <div class="dialog-wrapper">
              <input type="button" class="modal-x-btn"></input>
              <div id="dialog-body"></div>
              <button class="new-content-add-btn">ADD</button>
            </div>  
          </div>`)
    const closeBtn = this.element.querySelector('.modal-x-btn')! as HTMLElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener()
    }
    const submitBtn =  this.element.querySelector('.new-content-add-btn')! as HTMLElement;
    submitBtn.onclick = () => {
      this.submitListener && this.submitListener()
    }
  }

  setOnCloseListener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnSubmitListener(listener: OnSubmitListener) {
    this.submitListener = listener;
  }

  addChild(child: Component) {
    const body = this.element.querySelector('#dialog-body')! as HTMLElement;
    child.attachTo(body);
  }
}