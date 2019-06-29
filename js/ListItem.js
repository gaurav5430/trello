function buildCardNode() {
  const node = document.createElement('li');
  node.classList.add("item");
  node.draggable = true;
  return node;
}

class ListItem {
  constructor(item, onDeleteItem) {
    this.model = item;
    this.onDeleteItem = onDeleteItem;
    this.node = buildCardNode();
    this.node.id = item.id;

    this.onDrop = this.onDrop.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);

    this.node.ondragstart = (event) => this.onDragStart(event, this.node);
    this.node.ondragover = (event) => this.onDragOver(event, this.node);
    this.node.ondragenter = (event) => this.onDragEnter(event, this.node);
    this.node.ondrop = (event) => this.onDrop(event, this.node);
    this.node.ondrag = (event) => this.onDrag(event, this.node);
    this.node.ondragleave = (event) => this.onDragLeave(event, this.node);
    this.node.ondragend = this.onDragEnd.bind(this);
  }

  update(item) {
    this.model = item;
    this.node.getElementsByClassName("item__title")[0].innerHTML = item.title;
  }

  onDragStart(event, element) {
    window.draggedElement = element;

    event.dataTransfer.setData('item' , JSON.stringify(this.model));
    event.dataTransfer.setData('height' , this.node.clientHeight.toString());
  }

  onDrag(event, element) {
    this.node.classList.add('item__dragged');
  }

  onDragOver(event, element) {
    event.preventDefault();
  }

  onDragLeave(event, element) {
    element.classList.remove('drag');
    event.stopPropagation();
  }

  onDragEnter(event, element) {
    element.classList.add('drag');
    window.draggedOverElement = element;
  }

  onDragEnd(event) {
    this.node.classList.remove('item__dragged');

    //remove drop placeholder from all lists
    window.board.lists.forEach((list) => {
        list.removeDropPlaceholder();
    });
  }

  onDrop(event, element) {
    window.droppedOverElement = element;

    //sometimes drag leave is not called when dropped over an element
    element.classList.remove('drag');
  }

  render() {
    const that = this;

    const view = document.createElement('div');
    view.classList.add("item__view");

    const title = document.createElement('button');
    title.classList.add("item__title");
    title.innerHTML = this.model.title;
    view.appendChild(title);

    const flexSpan = document.createElement('span');
    flexSpan.classList.add("flex-span");
    view.appendChild(flexSpan);

    const remove = document.createElement('button');
    remove.classList.add("item__remove");
    remove.classList.add("remove");
    remove.innerHTML = " X ";

    remove.onclick = function() {
      that.onDeleteItem(that.model.id);
    }

    view.appendChild(remove);

    const edit = document.createElement('div');
    edit.classList.add('item__edit');
    edit.classList.add('hidden');

    const textarea = document.createElement('textarea');
    
    const save = document.createElement('button');
    save.innerHTML = "Save";

    const cancel = document.createElement('button');
    cancel.innerHTML = "Cancel";

    const actions = document.createElement('div');

    edit.appendChild(textarea);
    actions.appendChild(save);
    actions.appendChild(cancel);
    edit.appendChild(actions);

    save.onclick = function() {
      edit.classList.add('hidden');
      that.model.title = textarea.value;
      that.update(that.model);
      view.classList.remove('hidden');
    }

    cancel.onclick = function() {
      edit.classList.add('hidden');
      view.classList.remove('hidden');
    }

    title.onclick = function() {
      edit.classList.remove('hidden');
      view.classList.add('hidden');
      textarea.value = that.model.title;
    }

    this.node.appendChild(view);
    this.node.appendChild(edit);
    return this.node;
  }
}