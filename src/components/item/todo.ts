import { BaseComponent } from '../component.js'
export class TodoComponent extends BaseComponent<HTMLElement> {
  constructor(title:string, todo:string) {
    super(`<article class="task">
            <div class="task-wrapper">
              <h2 class="task-title">Task</h2>
              <input type="checkbox" class="task-content">
            </div>
            <input type="button" class="x-btn"></input>
          </article>`)
          
    const titleElement = this.element.querySelector('.task-title')!as HTMLHeadingElement;
    titleElement.textContent = title;

    const todoElement = this.element.querySelector('.task-content')!as HTMLInputElement;
    todoElement.insertAdjacentText('afterend', todo);
  }
}
