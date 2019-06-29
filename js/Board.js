class Board {
  constructor(title) {
    this.title = title;
    this.lists = [];
    this.listsDOM = document.createElement('ul');
    this.listid = 0;

    this.onDeleteList = this.onDeleteList.bind(this);
  }

  createList(listModel) {
    listModel.id = "list-" + this.listid++;
    return new List(listModel, this.onDeleteList);
  }

  add(listModel) {
    const list = this.createList(listModel);
    this.lists.push(list);
    return list;
  }

  onAddList(listModel) {
    const list = this.createList(listModel);
    this.lists.push(list);

    let listDOM = document.createElement('li');
    listDOM.className = "list";
    listDOM.appendChild(list.render());
    this.listsDOM.insertBefore(listDOM, this.listsDOM.childNodes[this.listsDOM.childNodes.length - 1]);
  }

  onDeleteList(id) {
    const index = this.lists.findIndex((list) => list.model.id === id);
    this.lists.splice(index, 1);
    this.listsDOM.removeChild(this.listsDOM.childNodes[index]);
  }

  remove(listId) {
    this.lists = this.lists.filter((list) => list.id !== listId);
  }

  render() {
    const board = document.createElement('div');
    board.className = "board";

    const title = document.createElement('div');
    title.className = "board__title";
    title.innerText = this.title;

    this.listsDOM.className = 'lists';

    this.lists.forEach((list) => {
      let listDOM = document.createElement('li');
      listDOM.className = "list";
      listDOM.appendChild(list.render());
      this.listsDOM.appendChild(listDOM);
    })
  
    this.listsDOM.appendChild(this.renderAddList());
  
    board.appendChild(title);
    board.appendChild(this.listsDOM);

    return board;
  }

  renderAddList() {
    const that = this;
    const addList = document.createElement('li');
    addList.className = "list";

    const title = document.createElement('div');
    title.innerText = "Add New List";

    const details = document.createElement('div');
    details.className = 'hidden';
    
    const text = document.createElement('input');
    text.setAttribute('type', "text");
    text.placeholder = "List Title";
    
    const button = document.createElement('button');
    button.innerText = 'Save';

    details.appendChild(text);
    details.appendChild(button);

    addList.appendChild(title);
    addList.appendChild(details);

    title.onclick = function() {
      details.className = '';
    }

    button.onclick = function() {
      that.onAddList({ title: text.value });
      text.value = '';
    }

    return addList;
  }
}