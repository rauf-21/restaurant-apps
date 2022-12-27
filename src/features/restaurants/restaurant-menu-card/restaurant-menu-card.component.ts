import { superstate } from '@superstate/core';
import { setChildren } from 'redom';

import { img, p } from '../../shared/utils/dom-elements';
import { Resource } from '../restaurant.model';
import './restaurant-menu-card.style.scss';

type MenuType = 'food' | 'drink';

class RestaurantMenuCard extends HTMLElement {
  static readonly tagName = 'restaurant-menu-card';

  private readonly menuType;

  private readonly menu;

  get template() {
    const menuType = this.menuType.now();
    const menu = this.menu.now();

    return [
      img({ src: `/images/${menuType}.svg`, alt: this.menu.now() }),
      p(menu.name),
    ];
  }

  constructor(menuType: MenuType, menu: Resource) {
    super();

    this.menuType = superstate(menuType);
    this.menu = superstate(menu);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(RestaurantMenuCard.tagName, RestaurantMenuCard);

export default RestaurantMenuCard;
