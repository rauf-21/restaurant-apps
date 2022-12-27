import { AsyncData, Result, Option } from '@swan-io/boxed';
import { superstate } from '@superstate/core';
import { setChildren, el } from 'redom';
import { replace } from 'feather-icons';
import { match } from 'ts-pattern';

import RESTAURANT_API_ENDPOINT from '../../shared/constants/restaurant-api-endpoint';
import {
  div,
  img,
  button,
  a,
  h1,
  h2,
  dl,
  dt,
  dd,
  i,
} from '../../shared/utils/dom-elements';
import { parseActiveUrlWithoutCombiner } from '../../shared/utils/url-parser';
import { Restaurant, getRestaurant } from '../restaurant.model';
import {
  isFavoriteRestaurant,
  addRestaurantToFavorite,
  removeRestaurantFromFavorite,
} from '../favorite-restaurant-catalogue/favorite-restaurant-idb.model';
import RestaurantMenuCard from '../restaurant-menu-card/restaurant-menu-card.component';
import RestaurantCustomerReviews from '../restaurant-customer-reviews/restaurant-customer-reviews.component';
import '../../ui/loading/loading.component';
import '../../ui/error/error.component';
import './restaurant-detail.style.scss';

class RestaurantDetail extends HTMLElement {
  static readonly tagName = 'restaurant-detail';

  readonly restaurantId = parseActiveUrlWithoutCombiner().id;

  readonly restaurant = superstate<AsyncData<Result<Restaurant, Error>>>(
    AsyncData.NotAsked()
  );

  private readonly restaurantRequest = this.restaurantId.map(getRestaurant);

  private readonly unsubscribeRestaurant = this.restaurant.subscribe(() => {
    this.render();
  });

  private readonly isFavoriteRestaurant = superstate(false);

  private readonly isFavoriteRestaurantRequest =
    this.restaurantId.map(isFavoriteRestaurant);

  private readonly unsubscribeIsFavoriteRestaurant =
    this.isFavoriteRestaurant.subscribe(() => {
      this.render();
    });

  get template() {
    const restaurant = this.restaurant.now();
    const isFavoriteRestaurant = this.isFavoriteRestaurant.now();

    return restaurant.match({
      NotAsked: () => [el('ui-loading')],
      Loading: () => [el('ui-loading')],
      Done: (result) =>
        result.match({
          Ok: (restaurant) => [
            div({ id: 'restaurant-picture-and-information' }, [
              img({
                src: RESTAURANT_API_ENDPOINT.PICTURE(
                  restaurant.pictureId,
                  'medium'
                ),
                alt: restaurant.name,
              }),
              div({ id: 'restaurant-information' }, [
                div({ id: 'restaurant-information-header' }, [
                  h1({ class: 'heading heading--anchor' }, restaurant.name),
                  isFavoriteRestaurant
                    ? button(
                        {
                          class: 'button button--danger',
                          onclick: this.handleFavoriteButtonClick.bind(this),
                          'aria-label': 'remove restaurant from restaurant',
                        },
                        [i({ 'data-feather': 'x' }), 'Remove from favorite']
                      )
                    : button(
                        {
                          class: 'button button--solid',
                          onclick: this.handleFavoriteButtonClick.bind(this),
                          'aria-label': 'add restaurant to favorite',
                        },
                        [i({ 'data-feather': 'plus' }), 'Add to favorite']
                      ),
                ]),
                dl({ class: 'dl' }, [
                  dt([i({ 'data-feather': 'map-pin' }), 'Address']),
                  dd(`${restaurant.address}, ${restaurant.city}`),
                  dt([i({ 'data-feather': 'star' }), 'Rating']),
                  dd(restaurant.rating),
                  dt([i({ 'data-feather': 'tag' }), 'Categories']),
                  dd(
                    restaurant.categories.map((category) =>
                      a({ class: 'tag', href: '/' }, category.name)
                    )
                  ),
                  dt([i({ 'data-feather': 'align-justify' }), 'Description']),
                  dd(restaurant.description),
                ]),
              ]),
            ]),
            div({ id: 'restaurant-menu' }, [
              h1({ class: 'heading heading--anchor' }, 'Menu'),
              h2('Food'),
              div(
                { id: 'restaurant-menu-food-list' },
                restaurant.menus.foods.map(
                  (food) => new RestaurantMenuCard('food', food)
                )
              ),
              h2('Drink'),
              div(
                { id: 'restaurant-menu-drink-list' },
                restaurant.menus.drinks.map(
                  (drink) => new RestaurantMenuCard('drink', drink)
                )
              ),
            ]),
            new RestaurantCustomerReviews(restaurant.customerReviews),
          ],
          Error: () => [el('ui-error')],
        }),
    });
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
    this.fetchRestaurant();
  }

  disconnectedCallback() {
    this.unsubscribeRestaurant();
    this.unsubscribeIsFavoriteRestaurant();
    this.restaurantRequest.match({
      Some: (restaurantRequest) => restaurantRequest.cancel(),
      None: () => {},
    });
  }

  fetchRestaurant() {
    this.restaurant.set(AsyncData.Loading());

    Option.allFromDict({
      restaurantRequest: this.restaurantRequest,
      isFavoriteRestaurantRequest: this.isFavoriteRestaurantRequest,
    }).match({
      Some: ({ restaurantRequest, isFavoriteRestaurantRequest }) => {
        restaurantRequest.tap((value) => {
          this.restaurant.set(AsyncData.Done(value));
        });

        isFavoriteRestaurantRequest.tap((value) => {
          this.isFavoriteRestaurant.set(value);
        });
      },
      None: () => {},
    });
  }

  handleFavoriteButtonClick() {
    const restaurant = this.restaurant.now();
    const isFavoriteRestaurant = this.isFavoriteRestaurant.now();

    restaurant.match({
      NotAsked: () => {},
      Loading: () => {},
      Done: (result) =>
        result.match({
          Ok: (restaurant) => {
            match(isFavoriteRestaurant)
              .with(true, () => {
                removeRestaurantFromFavorite(restaurant.id).tapOk(() => {
                  this.isFavoriteRestaurant.set((prev) => !prev);
                });
              })
              .with(false, () => {
                addRestaurantToFavorite(restaurant).tapOk(() => {
                  this.isFavoriteRestaurant.set((prev) => !prev);
                });
              })
              .exhaustive();
          },
          Error: () => {},
        }),
    });
  }

  render() {
    setChildren(this, this.template);
    replace();
  }
}

customElements.define(RestaurantDetail.tagName, RestaurantDetail);

export default RestaurantDetail;
