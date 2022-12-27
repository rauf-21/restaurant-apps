import { superstate } from '@superstate/core';
import { setChildren } from 'redom';

import { img, p } from '../../shared/utils/dom-elements';
import './error.style.scss';

class UIError extends HTMLElement {
  static readonly tagName = 'ui-error';

  private readonly text = superstate('');

  get template() {
    const text = this.text.now();

    return [img({ src: '/images/error.svg', alt: 'Error' }), p(text)];
  }

  constructor(
    text = 'Something went wrong. Please check your internet connection!'
  ) {
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

customElements.define(UIError.tagName, UIError);

export default UIError;
