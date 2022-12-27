import 'regenerator-runtime'; /* for async await transpile */
import { Future } from '@swan-io/boxed';
import { el, setChildren } from 'redom';

import { parseActiveUrlWithCombiner } from './features/shared/utils/url-parser';
import { swRegister } from './features/shared/utils/sw-register';
import routes from './routes';
import './index.scss';

customElements.define(
  'app-wrapper',
  class extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.renderPage();
      this.attachEvents();
    }

    disconnectedCallback() {
      this.detachEvents();
    }

    handleHashChange() {
      this.renderPage();
    }

    handleLoad() {
      swRegister();
    }

    attachEvents() {
      window.addEventListener('hashchange', this.handleHashChange.bind(this));

      window.addEventListener('load', this.handleLoad.bind(this));
    }

    detachEvents() {
      window.removeEventListener(
        'hashchange',
        this.handleHashChange.bind(this)
      );

      window.removeEventListener('load', () => this.handleLoad.bind(this));
    }

    renderPage() {
      const url = parseActiveUrlWithCombiner() as keyof typeof routes;

      const request = Future.fromPromise(routes[url]() as Promise<any>);

      window.scrollTo(0, 0);

      request.tapOk((request) => {
        const { default: Page } = request;
        const page = new Page();

        setChildren(this, [page]);
      });
    }
  }
);

setChildren(document.body, [el('app-wrapper')]);
