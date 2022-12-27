import { setChildren } from 'redom';

import { footer } from '../../shared/utils/dom-elements';
import './footer.style.scss';

class Footer extends HTMLElement {
  static readonly tagName = 'ui-footer';

  get template() {
    return [
      footer({
        innerHTML: 'Copyright &copy; 2022- RestaurAnt',
      }),
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

customElements.define(Footer.tagName, Footer);

export default Footer;
