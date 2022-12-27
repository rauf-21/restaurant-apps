import { superstate } from '@superstate/core';
import { setChildren } from 'redom';

import { img, p } from '../../shared/utils/dom-elements';
import './no-data.style.scss';

class UINoData extends HTMLElement {
  static readonly tagName = 'ui-no-data';

  private readonly text = superstate('');

  get template() {
    const text = this.text.now();

    return [img({ src: '/images/no-data.svg', alt: 'Error' }), p(text)];
  }

  constructor(text = 'Data not found') {
    super();
    this.text.set(text);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(UINoData.tagName, UINoData);

export default UINoData;
