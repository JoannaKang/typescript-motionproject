import { BaseComponent } from '../component.js'

export class ImageComponent extends BaseComponent<HTMLElement> {
  constructor(title:string, url:string) {
    super(`
    <article class="image">
      <img class="thumbnail">
      <div class="image-text"></div>
      <input type="button" class="x-btn"></input>
    </article>
    `)
    // image
    const imageElement = this.element.querySelector('.thumbnail')! as HTMLImageElement;
    imageElement.src = url;
    imageElement.alt = title;
    // text
    const titleElement = this.element.querySelector('.image-text')! as HTMLParagraphElement
    titleElement.textContent = title
  }
  attachTo(parent: HTMLElement, position: InsertPosition = 'afterbegin') {
    parent.insertAdjacentElement(position, this.element)
  }
}