import { setChildren } from 'redom';
import { replace } from 'feather-icons';

import { $ } from '../../shared/utils/dom-utils';
import {
  picture,
  source,
  img,
  div,
  h1,
  p,
  a,
  i,
} from '../../shared/utils/dom-elements';
import './hero.style.scss';

class UIHero extends HTMLElement {
  static readonly tagName = 'ui-hero';

  get template() {
    return [
      picture([
        source({
          srcset: './images/heros/hero-image-full.webp',
          media: '(min-width: 1000px)',
        }),
        source({
          srcset: './images/heros/hero-image-md.webp',
          media: '(min-width: 700px)',
        }),
        source({
          srcset: './images/heros/hero-image-sm.webp',
          media: '(min-width: 0px)',
        }),
        img({
          src: './images/heros/hero-image-sm.webp',
          width: 450,
          height: 1280,
          alt: 'hero image',
        }),
      ]),
      div(
        {
          id: 'hero-content',
        },
        [
          h1('FIND THE BEST RESTAURANT NEAR YOU'),
          p(
            'Browse our restorant catalogue to find the best restaurant near you'
          ),
          a(
            {
              class: 'button button--solid',
              href: '#',
              onclick: this.handleClick,
            },
            'BROWSE CATALOGUE',
            [
              i({
                alt: 'arrow right icon',
                'data-feather': 'arrow-right',
              }),
            ]
          ),
        ]
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

    $('#restaurant-catalogue').match({
      Some: (element) => {
        element.scrollIntoView(true);
      },
      None: () => {},
    });
  }

  render() {
    setChildren(this, this.template);
    replace();
  }
}

customElements.define(UIHero.tagName, UIHero);

export default UIHero;
