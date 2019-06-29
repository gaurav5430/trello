class Route {
  constructor(name, template, isDefault) {
    this.name = name;
    this.template = template;
    this.isDefault = isDefault;

    this.isActive = this.isActive.bind(this);
  }

  isActive(hashedPath) {
    return hashedPath.replace('#', '') === this.name;
  }
}