import { BaseComponent } from "../component.js";

export class VideoComponent extends BaseComponent<HTMLElement> {
  constructor(title:string, url:string) {
    super(`  <article class="video">
                <h2 class="video-title">Video</h2>
                <div class="video-player"><iframe class="video-iframe"></iframe></div>
                <div class="video-text">video title</div>
              </article>`)
    const iframe = this.element.querySelector('.video-iframe')!as HTMLIFrameElement;
    iframe.src = this.convertToEmbeddedURL(url);
    const titleElement = this.element.querySelector('.video-text')!as HTMLHeadingElement;
    titleElement.textContent = title
  }
  
  // input
  // https://www.youtube.com/watch?v=K3-jG52XwuQ
  // https://youtu.be/K3-jG52XwuQ
  // output
  // https://www.youtube.com/embed/K3-jG52XwuQ
  // 정규표현식 Regex
  // https://regexr.com/5l6nr
  private convertToEmbeddedURL(url: string): string {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:(?:youtube.com\/(?:(?:watch\?v=)|(?:embed\/))([a-zA-Z0-9-]{11}))|(?:youtu.be\/([a-zA-Z0-9-]{11})))/;
    const match = url.match(regExp);
    const videoId = match ? match[1] || match[2] : undefined;
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }
  
}