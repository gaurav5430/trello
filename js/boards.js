function renderBoards(rootElem) {
  const elem = document.createElement('div');
  window.boards.forEach((board) => {
    board.render(elem);
  })

  rootElem.append(elem);
}