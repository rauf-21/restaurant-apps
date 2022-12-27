import { el, setChildren } from 'redom';

import { header, main } from '../../features/shared/utils/dom-elements';

import '../../features/ui/nav/nav.component';
import '../../features/ui/footer/footer.component';
import '../../features/restaurants/restaurant-detail/restaurant-detail.component';

class RestaurantDetailPage extends HTMLElement {
  static readonly tagName = 'restaurant-detail-page';

  get template() {
    return [
      header([el('ui-nav')]),
      main([el('restaurant-detail')]),
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

customElements.define(RestaurantDetailPage.tagName, RestaurantDetailPage);

export default RestaurantDetailPage;
