import { AsyncData, Result, Option } from '@swan-io/boxed';
import { superstate } from '@superstate/core';
import { setChildren, el } from 'redom';

import { h1, section } from '../../shared/utils/dom-elements';
import { Restaurant } from '../restaurant.model';
import { getAllFavoriteRestaurants } from './favorite-restaurant-idb.model';
import RestaurantPreviewCard from '../restaurant-preview-card/restaurant-preview-card.component';
import UINoData from '../../ui/no-data/no-data.component';
import '../../ui/loading/loading.component';
import '../../ui/error/error.component';
import './favorite-restaurant-catalogue.style.scss';

class FavoriteRestaurantCatalogue extends HTMLElement {
  static readonly tagName = 'favorite-restaurant-catalogue';

  readonly favoriteRestaurants = superstate<
    AsyncData<Result<Option<Restaurant[]>, Error>>
  >(AsyncData.NotAsked());

  private readonly favoriteRestaurantsRequest = getAllFavoriteRestaurants();

  private readonly unsubscribeFavoriteRestaurants =
    this.favoriteRestaurants.subscribe(() => {
      this.render();
    });

  get template() {
    return [
      h1(
        {
          id: 'restaurant-catalogue',
          class: 'heading heading--anchor',
        },
        'Your Favorite Restaurants'
      ),
      section(
        {
          id: 'restaurant-list',
        },
        this.favoriteRestaurants.now().match({
          NotAsked: () => [el('ui-loading')],
          Loading: () => [el('ui-loading')],
          Done: (result) =>
            result.match({
              Ok: (favoriteRestaurants) =>
                favoriteRestaurants.match({
                  Some: (favoriteRestaurants) =>
                    favoriteRestaurants.map(
                      (favoriteRestaurant) =>
                        new RestaurantPreviewCard(favoriteRestaurant)
                    ),
                  None: () => [
                    new UINoData(
                      'You dont have favorite restaurants yet. Try adding some!'
                    ) as HTMLElement,
                  ],
                }),
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
    this.fetchFavoriteRestaurants();
  }

  disconnectedCallback() {
    this.unsubscribeFavoriteRestaurants();
    this.favoriteRestaurantsRequest.cancel();
  }

  fetchFavoriteRestaurants() {
    this.favoriteRestaurants.set(AsyncData.Loading());

    this.favoriteRestaurantsRequest.tap((value) => {
      this.favoriteRestaurants.set(AsyncData.Done(value));
    });
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(
  FavoriteRestaurantCatalogue.tagName,
  FavoriteRestaurantCatalogue
);

export default FavoriteRestaurantCatalogue;
