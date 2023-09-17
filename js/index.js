class Note {
  constructor(id, onRemove, note) {
    this.id = id
    this.onRemove = onRemove;
    this.note = note;
    this.createNote();
  }

  createNote = () => {
    this.noteElement = document.createElement('div');
    this.noteElement.className = 'note';

    this.content = document.createElement('p');
    this.content.className = 'content';
    this.content.textContent = this.note;
    this.noteElement.appendChild(this.content);

    const location_href = window.location.href;
    const href_array = location_href.split('/');
    const location = href_array[href_array.length - 1]

    this.removeButton = document.createElement('button');
    this.removeButton.className = 'function-button remove';
    this.removeButton.textContent = 'Remove';
    this.removeButton.addEventListener('click', () => this.removeNote())
    if(location == 'writer.html') {
      this.noteElement.appendChild(this.removeButton);
    }
  }

  removeNote = () => {
    if(this.onRemove != null) {
      this.onRemove(this.id)
    }
  }

  getNoteElement = () => {
    return this.noteElement
  }
}

class NoteApp {
  constructor() {
    this.arrayOfNote = [];
    this.initialize();
  }

  initialize() {
    this.setupEventListeners();
  }

  getLocalStorage = () => {
    let myLocalStorage = JSON.parse(localStorage.getItem('notes'));
    if(myLocalStorage == null) {
      return null;
    }
    return myLocalStorage
  }

  getDate = () => {
    const date = new Date()
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const second = String(date.getSeconds()).padStart(2, '0')
    if(this.location == 'writer.html') {
      this.time_stamp = 'Stored at ' + hour + ':' + minute + ':' + second
    } else {
      this.time_stamp = 'Updated at ' + hour + ':' + minute + ':' + second
    }
    this.timeStamp = document.getElementsByClassName('time')[0]
    this.timeStamp.textContent = this.time_stamp

  }

  removeNote = (id) => {
     this.arrayOfNote = this.arrayOfNote.filter(note => note.id != id)
     localStorage.clear()
     localStorage.setItem('notes', JSON.stringify(this.arrayOfNote))
     this.clearNoteContainer()
     this.populateNotes()
  }

  addNoteContainer = () => {
    const note = this.addTextArea.value;
    if(note.length < 1) {
      return;
    }

    const id = Math.floor(Math.random() * Date.now())

    let noteObj = new Note(id, this.removeNote, note);
    this.arrayOfNote.push(noteObj);
    let existed = this.getLocalStorage();
    if(existed == null) {
      localStorage.setItems('notes', JSON.stringify(this.arrayOfNote));
    } else {
      existed.push(noteObj)
      localStorage.setItem('notes', JSON.stringify(existed))
    }

    this.addTextArea.textContent = '';
    this.clearNoteContainer();
    this.populateNotes();
  }

  getLocation = () => {
    const location_href = window.location.href;
    const href_array = location_href.split('/');
    this.location = href_array[href_array.length - 1]
  }

  populateAddElement = (noteContainer) => {
    this.addNote = document.createElement('div');
    this.addNote.className = 'note';

    this.addTextArea = document.createElement('textarea');
    this.addTextArea.className = 'content';
    this.addTextArea.id = 'myInput';
    this.addNote.appendChild(this.addTextArea);

    this.addButton = document.createElement('button');
    this.addButton.className = 'function-button add';
    this.addButton.textContent = 'Add';
    this.addButton.addEventListener('click', this.addNoteContainer)
    this.addNote.appendChild(this.addButton);
    noteContainer.appendChild(this.addNote)
  }

  populateNotes = () => {
    this.getDate()
    this.getLocation()
    let arrNote = this.getLocalStorage();
    const noteContainer = document.getElementsByClassName('note-container')[0];

    if(arrNote == null) {
      this.populateAddElement(noteContainer);
      return;
    }
    this.arrayOfNote = arrNote
    this.arrayOfNote = JSON.parse(localStorage.getItem('notes'))
    this.arrayOfNote.forEach(noteObj => {
      const newNote = new Note(noteObj.id, this.removeNote, noteObj.note)
      noteContainer.appendChild(newNote.getNoteElement())
    })
    if(this.location == 'writer.html') {
      this.populateAddElement(noteContainer)
    }
  }


  clearNoteContainer = () => {
    const noteContainer = document.getElementsByClassName('note-container')[0];
    while(noteContainer.hasChildNodes()) {
      noteContainer.removeChild(noteContainer.firstChild)
    }
  }

  update = () => {
    this.getDate()
    if(this.getLocalStorage() == null|| this.arrayOfNote.length == this.getLocalStorage().length) {
      return
    }
    this.clearNoteContainer()
    this.populateNotes()
  }

  setupEventListeners = () => {
    window.addEventListener('load', this.populateNotes)
    setInterval(this.update, 2000)
  }
}

const noteApp = new NoteApp();