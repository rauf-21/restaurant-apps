import { setChildren, el } from 'redom';

import { header, main } from '../../features/shared/utils/dom-elements';
import '../../features/ui/nav/nav.component';
import '../../features/restaurants/favorite-restaurant-catalogue/favorite-restaurant-catalogue.component';
import '../../features/ui/footer/footer.component';

class FavoriteRestaurantsPage extends HTMLElement {
  static readonly tagName = 'favorite-restaurants-page';

  get template() {
    return [
      header([el('ui-nav')]),
      main({ id: 'main-content' }, [el('favorite-restaurant-catalogue')]),
      el('ui-footer'),
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(FavoriteRestaurantsPage.tagName, FavoriteRestaurantsPage);

export default FavoriteRestaurantsPage;
