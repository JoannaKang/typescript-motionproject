import { Composable, PageComponent, PageItemComponent } from './components/page/page.js';
import { Component } from './components/component.js'
import { ImageComponent } from './components/item/image.js'
import { NoteComponent } from './components/item/note.js';
import { TodoComponent } from './components/item/todo.js';
import { VideoComponent } from './components/item/video.js';
import { InputDialog, MediaData, TextData } from './components/dialog/dialog.js';
import { MediaSectionInput } from './components/dialog/input/media-input.js';
import { TextSectionInput } from './components/dialog/input/text-input.js';

type InputComponentConstructor<T = (MediaData | TextData) & Component> = {
  new ():T;
}

class App {
  private readonly page: Component & Composable;
  constructor(appRoot: HTMLElement, private dialogRoot: HTMLElement) {
    this.page = new PageComponent(PageItemComponent);
    this.page.attachTo(appRoot)

    this.bindElementToDialog<MediaSectionInput>(
      '.image-add-btn',
      MediaSectionInput,
      (input: MediaSectionInput) => new ImageComponent(input.title, input.url)
    );

    this.bindElementToDialog<MediaSectionInput>(
      '.video-add-btn',
      MediaSectionInput,
      (input: MediaSectionInput) => new VideoComponent(input.title, input.url)
    );

    this.bindElementToDialog<TextSectionInput>(
      '.note-add-btn',
      TextSectionInput,
      (input: TextSectionInput) => new NoteComponent(input.title, input.body)
    );

    this.bindElementToDialog<TextSectionInput>(
      '.task-add-btn',
      TextSectionInput,
      (input: TextSectionInput) => new TodoComponent(input.title, input.body)
    );
    this.page.addChild(new ImageComponent('Image Title', 'https://picsum.photos/800/400'));
    this.page.addChild(new VideoComponent('Video Title', 'https://youtu.be/D7cwvvA7cP0'));
    this.page.addChild(new NoteComponent('Note Title', "Don't forget to code your dream"));
    this.page.addChild(new TodoComponent('Todo Title', 'TypeScript Course!'));
    this.page.addChild(new ImageComponent('Image Title', 'https://picsum.photos/800/400'));
    this.page.addChild(new VideoComponent('Video Title', 'https://youtu.be/D7cwvvA7cP0'));
    this.page.addChild(new NoteComponent('Note Title', "Don't forget to code your dream"));
    this.page.addChild(new TodoComponent('Todo Title', 'TypeScript Course!'));
  }

  private bindElementToDialog<T extends MediaSectionInput | TextSectionInput>(
    selector:string,
    InputComponent: InputComponentConstructor<T>,
    makeSection: (input: T) => Component
  ) {
    const element = document.querySelector(selector)! as HTMLElement;
    element.addEventListener('click',  () => {
      const dialog = new InputDialog();
      const inputSection = new InputComponent();

      dialog.addChild(inputSection); 
      dialog.attachTo(this.dialogRoot);

      dialog.setOnCloseListener(() => {
        dialog.removeFrom(this.dialogRoot)
      });
      dialog.setOnSubmitListener(() => {
        const content = makeSection(inputSection);
        this.page.addChild(content)
        dialog.removeFrom(this.dialogRoot)
      });
    })    
  }
}

new App(document.querySelector('.content-area')! as HTMLElement, document.body)

// open modal popup

// add video info : title / url

// add image info: title / url

// add note: title / body text

// add task : title / todo item

// remove item : click x button