import { BaseComponent, Component } from "../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OncloseListner = () => void;

export interface SectionContainer extends Component, Composable {
  setOnCloseListener(listner: OncloseListner): void;
}

type SectionContainerConstructor =  {
  new (): SectionContainer; // new: 새로운 생성자를 정의하는 타입
}


// 새로 생성된 컨텐츠들을 감싸는 컨테이너를 만드는 클래스
export class PageItemComponent extends BaseComponent<HTMLUListElement> implements SectionContainer {
  private closeListener?: OncloseListner;

  constructor() {
    super(`<li class="page-item">
              <section class="page-item-body"></section>
              <div class="page-item-controls">
                <input type="button" class="x-btn"></input>
              </div>
            </li>`)
    const closeBtn = this.element.querySelector('.x-btn')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    }
  }
  addChild(child: Component) {
    const container = this.element.querySelector('.page-item-body')!as HTMLElement;
    child.attachTo(container)
  }
  setOnCloseListener(listner: OncloseListner) {
    this.closeListener = listner;
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor(private pageItemConstructor:SectionContainerConstructor) {
    super('<ul class="page"></ul>')
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element)
    })
  }
}