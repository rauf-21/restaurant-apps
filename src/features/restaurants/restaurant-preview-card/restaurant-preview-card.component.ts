import { superstate } from '@superstate/core';
import { setChildren } from 'redom';
import { replace } from 'feather-icons';

import RESTAURANT_API_ENDPOINT from '../../shared/constants/restaurant-api-endpoint';
import { RestaurantPreview } from '../restaurant.model';
import { img, div, span, a, i, h2, p } from '../../shared/utils/dom-elements';
import { truncate } from '../../shared/utils/string-utils';
import './restaurant-preview-card.style.scss';

class RestaurantPreviewCard extends HTMLElement {
  static readonly tagName = 'restaurant-preview-card';

  private restaurantPreview;

  get template() {
    const restaurantPreview = this.restaurantPreview.now();

    return [
      img({
        src: RESTAURANT_API_ENDPOINT.PICTURE(
          restaurantPreview.pictureId,
          'small'
        ),
        loading: 'lazy',
        alt: '',
      }),
      div(
        {
          class: 'restaurant-card-description',
        },
        [
          div({ class: 'restaurant-card-rating-and-city' }, [
            span({ class: 'restaurant-card-rating' }, [
              i({
                width: '20px',
                height: '20px',
                alt: 'star icon',
                'data-feather': 'star',
              }),
              restaurantPreview.rating,
            ]),
            span({ class: 'restaurant-card-city' }, [
              i({
                width: '20px',
                height: '20px',
                alt: 'star icon',
                'data-feather': 'map-pin',
              }),
              restaurantPreview.city,
            ]),
          ]),
          h2(restaurantPreview.name),
          p(truncate(restaurantPreview.description)),
          a(
            {
              class: 'button button--ghost',
              href: `#/detail/${restaurantPreview.id}`,
            },
            'VIEW'
          ),
        ]
      ),
    ];
  }

  constructor(restaurantPreview: RestaurantPreview) {
    super();

    this.restaurantPreview = superstate(restaurantPreview);
  }

  connectedCallback() {
    this.render();
  }

  render() {
    setChildren(this, this.template);
    replace();
  }
}

customElements.define(RestaurantPreviewCard.tagName, RestaurantPreviewCard);

export default RestaurantPreviewCard;
