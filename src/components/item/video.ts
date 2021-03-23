import { BaseComponent } from "../component.js";

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title:string, url:string) {
    super(`  <article class="video">
                <div class="video-player"><iframe class="video-iframe"></iframe></div>
                <h3 class="video-title"></h3>
                <input type="button" class="x-btn"></input>
              </article>`)
    const iframe = this.element.querySelector('.video-iframe')!as HTMLIFrameElement;
    iframe.src = url;
    const titleElement = this.element.querySelector('.video-title')!as HTMLHeadingElement;
    titleElement.textContent = title
  }
}