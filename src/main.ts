import { PageComponent } from './components/page/page.js';
import { ImageComponent } from './components/item/image.js'
import { NoteComponent } from './components/item/note.js';
import { TodoComponent } from './components/item/todo.js';
import { VideoComponent } from './components/item/video.js';

class App {
  private readonly page: PageComponent
  constructor(appRoot: HTMLElement) {
    this.page = new PageComponent();
    this.page.attachTo(appRoot)

    const video = new VideoComponent ('Video title', 'https://www.youtube.com/embed/nxKfi-6EtmY');
    console.log(video)
    video.attachTo(appRoot, 'beforeend');
    const image = new ImageComponent ('Image title', 'https://picsum.photos/600/300');
    image.attachTo(appRoot, 'beforeend')
    const note = new NoteComponent('Note title', 'Note Body')
    note.attachTo(appRoot, 'beforeend');
    const todo = new TodoComponent ('Todo title', 'Todo Item')
    todo.attachTo(appRoot, 'beforeend');
  }
}

new App(document.querySelector('.content-area')! as HTMLElement)

// open modal popup

// add video info : title / url

// add image info: title / url

// add note: title / body text

// add task : title / todo item

// remove item : click x button