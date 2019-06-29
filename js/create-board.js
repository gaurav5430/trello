function createBoard(event) {
  event.preventDefault();
  const title = document.boardForm.title.value;
  const description = document.boardForm.description.value;
  const board = new Board(title, description);
  
  if(!window.boards) {
    window.boards = [];
  }

  window.boards.push(board);
  router.goToRoute('boards');
}