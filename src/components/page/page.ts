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
  muteChildren(state: 'mute'|'unmute'): void;
  getBoundingRect():DOMRect;
  onDropped():void;
}

type SectionContainerConstructor =  {
  new (): SectionContainer; // new: 새로운 생성자를 정의하는 타입
}


// 새로 생성된 컨텐츠들을 감싸는 컨테이너를 만드는 클래스
export class PageItemComponent extends BaseComponent<HTMLUListElement> implements SectionContainer {
  private closeListener?: OncloseListner;
  private dragStateListener?: OnDragStateListener<PageItemComponent>;

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
    this.notifyDrageObservers('start');
    this.element.classList.add('lifted');
  }
  onDragEnd(_:DragEvent) {
    this.notifyDrageObservers('stop');
    this.element.classList.remove('lifted')
  }
  onDragEnter(_:DragEvent) {
    this.notifyDrageObservers('enter')
    console.log(this.element)
    this.element.classList.add('drop-area');
  }
  onDragLeave(_:DragEvent) {
    this.notifyDrageObservers('leave')
    this.element.classList.remove('drop-area');
  }

  onDropped() {
    this.element.classList.remove('drop-area');
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
  muteChildren(state: 'mute'| 'unmute') {
    if(state === 'mute') {
      this.element.classList.add('mute-children')
    } else {
      this.element.classList.remove('mute-children')
    }
  }
  getBoundingRect():DOMRect {
    return this.element.getBoundingClientRect();
  }
}

export class PageComponent extends BaseComponent<HTMLUListElement> implements Composable {
  private children = new Set<SectionContainer>(); // 중복되는 데이터를 가질 수 없는 자료구조
  private dragTarget?: SectionContainer;
  private dropTarget?: SectionContainer;
  
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
  }
  onDrop(event:DragEvent) {
    event.preventDefault()
    // 여기서 위치변경 기능 구현
    if (!this.dropTarget) {
      return;
    }
    if (this.dragTarget && this.dropTarget !== this.dragTarget) {
      const dropY = event.clientY;
      const srcElement = this.dragTarget.getBoundingRect();
      this.dragTarget.removeFrom(this.element);
      this.dropTarget.attach(this.dragTarget, dropY < srcElement.y ? 'beforebegin' : 'afterend')
    }
    this.dropTarget.onDropped();
  }

  addChild(section: Component) {
    const item = new this.pageItemConstructor();
    item.addChild(section);
    item.attachTo(this.element, 'beforeend');
    item.setOnCloseListener(() => {
      item.removeFrom(this.element)
      this.children.delete(item);
    })
    this.children.add(item);
    item.setOnDrageStateListener((target:SectionContainer, state:DragState) => {
      switch(state) {
        case 'start':
          this.dragTarget = target;
          this.updateSections('mute')
          break;
        case 'stop':
          this.dragTarget = undefined;
          this.updateSections('unmute')
          break;
        case 'enter':
          this.dropTarget = target;
          break;
        case 'leave':
          this.dropTarget = undefined;
          break;
        default:
          throw new Error(`unsopported state: ${state}`)
      }
    });
  }
  private updateSections(state:'mute'|'unmute') {
    this.children.forEach((section: SectionContainer) => {
      section.muteChildren(state)
    })
  }
}