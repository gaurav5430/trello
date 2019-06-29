class List {
  constructor(listModel, onDelete) {
    this.model = listModel;
    this.onDelete = onDelete;
    this.node = this.buildListNode();
    this.items = [];
    this.itemsDOM = document.createElement('ul');
    this.itemsDOM.id = listModel.id;
    this.itemsDOM.ondragleave = this.onDragLeave.bind(this);
    this.itemsDOM.ondragover = this.onDragOver.bind(this);
    this.itemsDOM.ondragenter = this.onDragEnter.bind(this);
    this.itemsDOM.ondrop = this.onDrop.bind(this);

    this.childId = 0;
    this.onDeleteItem = this.onDeleteItem.bind(this);
    this.addDropPlaceholder = this.addDropPlaceholder.bind(this);
    this.removeDropPlaceholder = this.removeDropPlaceholder.bind(this);

    this.placeholder = document.createElement('div');
    this.placeholder.classList.add('list__placeholder');
  }

  createListItem(itemModel) {
    itemModel.id = this.model.id + "_item-" + this.childId++;
    return new ListItem(itemModel, this.onDeleteItem);
  }

  update(title) {
    this.model.title = title;
    this.node.getElementsByClassName("list__title")[0].innerHTML = title;
  }

  buildListNode() {
    const wrapper = document.createElement('div');
    wrapper.className = "list__wrapper";

    return wrapper;
  }

  onDragLeave(event) {
  }

  onDragOver(event) {
    event.preventDefault();
  }

  onDragEnter(event) {

    //remove placeholders from all other lists
    window.board.lists.forEach((list) => {
      if(list !== this) {
        list.removeDropPlaceholder();
      }
    });

    if(window.draggedElement !== window.draggedOverElement) { 
      this.addDropPlaceholder(window.draggedOverElement); 
    }
  }

  onDrop(event) {
    const element = window.draggedOverElement || window.draggedElement;
    const itemModel = JSON.parse(event.dataTransfer.getData('item'));
    const sourceListId = itemModel.id.split("_")[0];

    const sourceList =  window.board.lists.filter((list) => list.model.id === sourceListId)[0];
    
    if(window.draggedOverElement === window.draggedElement) {
      //don't do anything if it is the same element
    }
    else {
      sourceList.onDeleteItem(itemModel.id);
      this.onAddItem(itemModel, element);
    }

    this.removeDropPlaceholder();
  }

  add(itemModel) {
    this.items.push(this.createListItem(itemModel));
  }

  remove(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  onAddItem(itemModel, after) {
    const item = this.createListItem(itemModel);
    this.items.push(item);

    if(after) {
      this.itemsDOM.insertBefore(item.render(), after.nextSibling);
    } else {
      this.itemsDOM.appendChild(item.render());
    }
  }

  addDropPlaceholder(after) {
    if(!after) {
      this.itemsDOM.appendChild(this.placeholder);
    }
    else {
      this.itemsDOM.insertBefore(this.placeholder, after.nextSibling);
    }
    //this.placeholder.style.height = height + "px";
  }

  removeDropPlaceholder() {
    if(this.itemsDOM.contains(this.placeholder)) {
      this.itemsDOM.removeChild(this.placeholder);
    }
  }

  onDeleteItem(id) {
    const index = this.items.findIndex((item) => item.model.id === id);
    this.items.splice(index, 1);
    this.itemsDOM.removeChild(document.getElementById(id));
  }

  renderItemPlaceholder() {
    const that = this;

    const itemPlaceholder = document.createElement('div');
    itemPlaceholder.classList.add('item');
    itemPlaceholder.classList.add('item__placeholder');
    
    const textarea = document.createElement('textarea');
    textarea.placeholder = "Enter a Title for this card";
    
    const actions = document.createElement('div');
    const save = document.createElement('button');
    save.innerText = 'Add';

    save.onclick = function() {
      that.onAddItem({ title: textarea.value});
      textarea.value = '';
      that.node.removeChild(itemPlaceholder);
    }

    const close = document.createElement('button');
    close.innerText = 'Cancel';

    close.onclick = function() {
      textarea.value = '';
      that.node.removeChild(itemPlaceholder);
    }

    actions.appendChild(save);
    actions.appendChild(close);
    itemPlaceholder.appendChild(textarea);
    itemPlaceholder.appendChild(actions);
    this.node.insertBefore(itemPlaceholder, this.node.childNodes[this.node.childNodes.length - 1]);
  }

  renderAddItemTrigger() {
    const that = this;
    const trigger = document.createElement('button');
    trigger.className = "list__add-trigger";
    trigger.innerText = "Add New Item";

    trigger.onclick = function() {
      that.renderItemPlaceholder();
    }

    return trigger;
  }

  renderListHeader() {
    const that = this;

    const header = document.createElement('div');
    header.classList.add('list__header');

    const title = document.createElement('button');
    title.innerHTML = this.model.title;
    title.className = "list__title";

    const remove = document.createElement('button');
    remove.classList.add('list__remove');
    remove.classList.add('remove');
    remove.innerHTML = ' X ';

    remove.onclick = function() {
      that.onDelete(that.model.id);
    }

    const edit = document.createElement('div');
    edit.classList.add('list__edit');
    edit.classList.add('hidden');

    const editTitle = document.createElement('input');
    editTitle.setAttribute("type", "text");

    const save = document.createElement('button');
    save.innerHTML = "Save";
    save.onclick = function() {
      that.update(editTitle.value);
      edit.classList.add('hidden');
      title.classList.remove('hidden');
    }

    edit.appendChild(editTitle);
    edit.appendChild(save);

    title.onclick = function() {
      edit.classList.remove('hidden');
      editTitle.value = that.model.title;
      title.classList.add('hidden');
    }

    header.appendChild(title);
    header.appendChild(edit);
    header.appendChild(remove);

    return header;
  }

  render() {
    const that = this;
    
    this.itemsDOM.className = "items";

    this.items.forEach((item) => {
     this.itemsDOM.appendChild(item.render());
    });

    this.node.appendChild(this.renderListHeader());
    this.node.appendChild(this.itemsDOM);
    this.node.appendChild(this.renderAddItemTrigger());

    return this.node;
  }
}