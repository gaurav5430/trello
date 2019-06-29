function createBoardFromJson(boardJson, rootElement) {
  const board = new Board(boardJson.title);
  boardJson.lists.forEach((list) => {
    const l = board.add(list);
    list.items.forEach((item) => {
      l.add(item);
    });
  });

  rootElement.append(board.render());
  window.board = board;
}