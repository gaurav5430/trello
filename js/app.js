function onRouteChangeCallback(routeName) {
  if(routeName === 'boards') {
      
  }
}

const router = new Router([
  new Route('create-board', 'create-board.html', true),
  new Route('boards', 'boards.html'),
], document.getElementById('routerRoot'), onRouteChangeCallback);
