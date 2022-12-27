import { replace } from 'feather-icons';
import { superstate } from '@superstate/core';
import { setChildren } from 'redom';

import {
  img,
  h1,
  ul,
  li,
  a,
  button,
  div,
  i,
} from '../../shared/utils/dom-elements';
import './nav.style.scss';

interface NavLink {
  name: string;
  href: string;
}

interface NavRef {
  drawer: ReturnType<typeof div> | null;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/#' },
  { name: 'Favorite', href: '/#/favorite' },
  { name: 'About Us', href: 'https://github.com/rauf-21' },
];

class UINav extends HTMLElement {
  static readonly tagName = 'ui-nav';

  private ref = superstate<NavRef>({
    drawer: null,
  });

  get navLinkItems() {
    return NAV_LINKS.map(({ name, href }) =>
      li([a(name, { class: 'link', href })])
    );
  }

  get template() {
    const { drawer } = this.ref
      .set((prev) => ({
        ...prev,
        drawer: div(
          {
            id: 'drawer',
          },
          [
            button(
              {
                id: 'drawer-close-button',
                class: 'button button--solid',
                type: 'button',
                'aria-label': 'close navigation button',
                onclick: this.handleDrawerToggleButton.bind(this),
              },
              i({ alt: 'menu icon', 'data-feather': 'x' })
            ),
            ul(this.navLinkItems),
          ]
        ),
      }))
      .now();

    return [
      img({
        src: './icons/logo.svg',
        alt: 'website logo',
        width: 45,
        height: 45,
      }),
      h1('RestaurAnt'),
      ul(this.navLinkItems),
      button(
        {
          id: 'drawer-show-button',
          class: 'button button--solid',
          type: 'button',
          'aria-label': 'show navigation button',
          onclick: this.handleDrawerToggleButton.bind(this),
        },
        i({ alt: 'menu icon', 'data-feather': 'menu' })
      ),
      drawer,
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  handleDrawerToggleButton(event: Event) {
    this.ref.now().drawer.classList.toggle('open');
    event.stopPropagation();
  }

  render() {
    setChildren(this, this.template);
    replace();
  }
}

customElements.define(UINav.tagName, UINav);

export default UINav;
