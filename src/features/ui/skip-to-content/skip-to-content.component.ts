import { setChildren } from 'redom';

import { $ } from '../../shared/utils/dom-utils';
import { a } from '../../shared/utils/dom-elements';
import './skip-to-content.style.scss';

class UISkipToContent extends HTMLElement {
  static readonly tagName = 'ui-skip-to-content';

  get template() {
    return [
      a(
        {
          id: 'skip-to-content',
          class: 'link',
          href: '#',
          onclick: this.handleClick.bind(this),
        },
        'Skip To Content'
      ),
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  handleClick(event: Event) {
    event.preventDefault();

    $('#main-content').match({
      Some: (element) => {
        element.scrollIntoView(true);
      },
      None: () => {},
    });
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(UISkipToContent.tagName, UISkipToContent);

export default UISkipToContent;
