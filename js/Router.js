class Router {
  constructor(routes, rootElem, onRouteChangeCallback) {
    this.routes = routes;
    this.rootElem = rootElem;
    this.onRouteChangeCallback = onRouteChangeCallback;
    
    this.hashChanged = this.hashChanged.bind(this);
    this.goToRoute = this.goToRoute.bind(this);

    window.addEventListener('hashchange', (e) => {
      this.hashChanged();
    });

    this.hashChanged();
  }

  hashChanged() {
    if(window.location.hash.length > 0) {
      this.routes.forEach((route) => {
        if(route.isActive(window.location.hash.substr(1))) {
          this.goToRoute(route.name);
        }
      })
    }

    else {
      //go to default route
      this.routes.forEach((route) => {
        if(route.isDefault) {
          this.goToRoute(route.name);
        }
      })
    }
  }

  goToRoute(routeName) {
    // get template from route name
    const route = this.routes.filter((route) => { return route.name === routeName })[0];
    const that = this;
    const url = 'Views/' + route.template;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if(this.readyState === 4 && this.status == 200) {
        that.rootElem.innerHTML = this.responseText;
      }
    }

    xhr.open('GET', url, true);
    xhr.send();

    this.onRouteChange(this.onRouteChangeCallback, routeName)
  }

  onRouteChange(fn, routeName) {
    fn(routeName);
  }
}