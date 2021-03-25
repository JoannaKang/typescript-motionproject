import { BaseComponent, Component } from "../component.js";

export interface Composable {
  addChild(child: Component): void;
}

type OncloseListner = () => void;
type DragState = 'start' | 'stop' | 'enter' | 'leave'
type OnDragStateListener<T extends Component> = (target: T, state: DragState) => void;

export interface SectionContainer extends Component, Composable {
  setOnCloseListener(listner: OncloseListner): void;
  setOnDrageStateListener(listner: OnDragStateListener<SectionContainer>): void;
}

type SectionContainerConstructor =  {
  new (): SectionContainer; // new: 새로운 생성자를 정의하는 타입
}


// 새로 생성된 컨텐츠들을 감싸는 컨테이너를 만드는 클래스
export class PageItemComponent extends BaseComponent<HTMLUListElement> implements SectionContainer {
  private closeListener?: OncloseListner;
  private dragStateListener?: OnDragStateListener<PageItemComponent>

  constructor() {
    super(`<li draggable="true" class="page-item">
              <section class="page-item-body"></section>
              <div class="page-item-controls">
                <input type="button" class="x-btn"></input>
              </div>
            </li>`)
    const closeBtn = this.element.querySelector('.x-btn')! as HTMLButtonElement;
    closeBtn.onclick = () => {
      this.closeListener && this.closeListener();
    }
    this.element.addEventListener('dragstart', (event:DragEvent) => {
      this.onDragStart(event);
    })
    this.element.addEventListener('dragend', (event:DragEvent) => {
      this.onDragEnd(event);
    })
    this.element.addEventListener('dragenter', (event:DragEvent) => {
      this.onDragEnter(event);
    })
    this.element.addEventListener('dragleave', (event:DragEvent) => {
      this.onDragLeave(event);
    })
  }

  onDragStart(_:DragEvent) {
    this.notifyDrageObservers('start')
  }
  onDragEnd(_:DragEvent) {
    this.notifyDrageObservers('stop')
  }
  onDragEnter(_:DragEvent) {
    this.notifyDrageObservers('enter')
  }
  onDragLeave(_:DragEvent) {
    this.notifyDrageObservers('leave')
  }

  notifyDrageObservers(state:DragState) {
    this.dragStateListener && this.dragStateListener(this, state)
  }

  addChild(child: Component) {
    const container = this.element.querySelector('.page-item-body')!as HTMLElement;
    child.attachTo(container)
  }
  setOnCloseListener(listner: OncloseListner) {
    this.closeListener = listner;
  }
  setOnDrageStateListener(listner: OnDragStateListener<PageItemComponent>) {
    this.dragStateListener = listner;
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  constructor(private pageItemConstructor:SectionContainerConstructor) {
    super('<ul class="page"></ul>')
    this.element.addEventListener('dragover', (event:DragEvent) => {
      this.onDragOver(event);
    })
    this.element.addEventListener('drop', (event:DragEvent) => {
      this.onDrop(event);
    })
  }

  onDragOver(event:DragEvent) {
    event.preventDefault()
    console.log('onDrageOver');
    
  }
  onDrop(event:DragEvent) {
    event.preventDefault()
    console.log('onDrop');
        
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element)
    })
    item.setOnDrageStateListener((target:SectionContainer, state:DragState) => {
      console.log(target, state)
    })
  }
}