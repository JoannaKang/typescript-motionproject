import { BaseComponent } from '../component.js'
export class NoteComponent extends BaseComponent<HTMLElement> {
  constructor(title:string, body:string) {
    super(` <article class="note">
              <div class="note-wrapper">
                <h2 class="note-title">Note</h2>
                <div class="note-content"><h3>Note content</h3></div>
              </div>
              <input type="button" class="x-btn"></input>
            </article>`)
          
    const titleElement = this.element.querySelector('.note-title')!as HTMLHeadElement;
    titleElement.textContent = title;

    const bodyElement = this.element.querySelector('.note-content')!as HTMLParagraphElement;
    bodyElement.textContent = body;
  }
}
