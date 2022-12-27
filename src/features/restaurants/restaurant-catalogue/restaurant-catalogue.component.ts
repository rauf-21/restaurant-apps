import { AsyncData, Result } from '@swan-io/boxed';
import { superstate } from '@superstate/core';
import { setChildren, el } from 'redom';

import { h1, section } from '../../shared/utils/dom-elements';
import {
  RestaurantPreview,
  getAllRestaurantPreviews,
} from '../restaurant.model';
import RestaurantPreviewCard from '../restaurant-preview-card/restaurant-preview-card.component';
import '../../ui/loading/loading.component';
import '../../ui/error/error.component';
import './restaurant-catalogue.style.scss';

class RestaurantCatalogue extends HTMLElement {
  static readonly tagName = 'restaurant-catalogue';

  private readonly restaurantPreviews = superstate<
    AsyncData<Result<RestaurantPreview[], Error>>
  >(AsyncData.NotAsked());

  private readonly restaurantPreviewsRequest = getAllRestaurantPreviews();

  private readonly unsubscribeRestaurantPreviews =
    this.restaurantPreviews.subscribe(() => {
      this.render();
    });

  get template() {
    return [
      h1(
        {
          id: 'restaurant-catalogue',
          class: 'heading heading--anchor',
        },
        'Our Catalogue'
      ),
      section(
        {
          id: 'restaurant-list',
        },
        this.restaurantPreviews.now().match({
          NotAsked: () => [el('ui-loading')],
          Loading: () => [el('ui-loading')],
          Done: (result) =>
            result.match({
              Ok: (restaurantPreviews) =>
                restaurantPreviews.map(
                  (restaurantPreview) =>
                    new RestaurantPreviewCard(restaurantPreview)
                ),
              Error: () => [el('ui-error')],
            }),
        })
      ),
    ];
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.fetchRestaurantPreviews();
  }

  disconnectedCallback() {
    this.unsubscribeRestaurantPreviews();
    this.restaurantPreviewsRequest.cancel();
  }

  fetchRestaurantPreviews() {
    this.restaurantPreviews.set(AsyncData.Loading());

    this.restaurantPreviewsRequest.tap((value) =>
      this.restaurantPreviews.set(AsyncData.Done(value))
    );
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(RestaurantCatalogue.tagName, RestaurantCatalogue);

export default RestaurantCatalogue;
