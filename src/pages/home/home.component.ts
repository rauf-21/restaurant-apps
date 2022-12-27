import { el, setChildren } from 'redom';
import { header, main } from '../../features/shared/utils/dom-elements';

import { $ } from '../../features/shared/utils/dom-utils';
import UISkipToContent from '../../features/ui/skip-to-content/skip-to-content.component';
import '../../features/ui/nav/nav.component';
import '../../features/ui/hero/hero.component';
import '../../features/restaurants/restaurant-catalogue/restaurant-catalogue.component';
import '../../features/restaurants/restaurant-best-customer-reviews/restaurant-best-customer-reviews.component';
import '../../features/ui/footer/footer.component';

export default class HomePage extends HTMLElement {
  static readonly tagName = 'home-page';

  get template() {
    return [
      header([el('ui-nav')]),
      el('ui-hero'),
      main({ id: 'main-content' }, [
        el('restaurant-catalogue'),
        el('restaurant-best-customer-reviews'),
      ]),
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

    $('app-wrapper').match({
      Some: (element) => {
        element.insertAdjacentElement('afterbegin', new UISkipToContent());
      },
      None: () => {},
    });
  }
}

customElements.define(HomePage.tagName, HomePage);
