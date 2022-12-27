import { superstate } from '@superstate/core';
import { setChildren } from 'redom';

import {
  h1,
  h2,
  div,
  span,
  form,
  input,
  label,
  button,
  textarea,
  p,
} from '../../shared/utils/dom-elements';
import {
  Restaurant,
  CustomerReview,
  addCustomerReview,
} from '../restaurant.model';
import { parseActiveUrlWithoutCombiner } from '../../shared/utils/url-parser';
import './restaurant-customer-reviews.style.scss';

class RestaurantCustomerReviews extends HTMLElement {
  static readonly tagName = 'restaurant-customer-reviews';

  private readonly restaurantId = parseActiveUrlWithoutCombiner().id;

  private readonly customerReviews;

  private readonly unsubscribeCustomerReviews;

  get template() {
    const customerReviews = this.customerReviews.now();

    return [
      h1({ class: 'heading heading--anchor' }, 'Customer Review'),
      div(
        { id: 'restaurant-customer-reviews' },
        customerReviews.map((customerReview) =>
          div({ class: 'restaurant-customer-review' }, [
            div({ class: 'restaurant-customer-review-name-and-date' }, [
              span(
                { class: 'restaurant-customer-review-name' },
                customerReview.name
              ),
              span(
                { class: 'restaurant-customer-review-date' },
                customerReview.date
              ),
            ]),
            p(customerReview.review),
          ])
        ),
        h2('Tell us what you feel!'),
        form(
          {
            id: 'restaurant-customer-review-form',
            onsubmit: this.handleFormSubmit.bind(this),
          },
          [
            label(
              {
                class: 'label',
                htmlFor: 'restaurant-customer-review-form-name',
              },
              'Name'
            ),
            input({
              class: 'input',
              name: 'name',
              id: 'restaurant-customer-review-form-name',
              type: 'text',
              placeholder: 'Your name...',
              required: true,
            }),
            label(
              {
                class: 'label',
                htmlFor: 'restaurant-customer-review-form-review',
              },
              'Review'
            ),
            textarea({
              class: 'input',
              placeholder: 'Write your review here...',
              name: 'review',
              id: 'restaurant-customer-review-form-review',
              cols: 30,
              rows: 10,
              required: true,
            }),
            button({ class: 'button button--solid', type: 'submit' }, 'Post'),
          ]
        )
      ),
    ];
  }

  constructor(customerReviews: CustomerReview[]) {
    super();

    this.customerReviews = superstate(customerReviews);
    this.unsubscribeCustomerReviews = this.customerReviews.subscribe(() => {
      this.render();
    });
  }

  connectedCallback() {
    this.render();
  }

  disconnectedCallback() {
    this.unsubscribeCustomerReviews();
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();

    this.restaurantId.match({
      Some: (restaurantId) => {
        const formData = new FormData(event.target as HTMLFormElement);

        formData.append('id', restaurantId);

        const payload = Object.fromEntries(formData) as {
          id: Restaurant['id'];
        } & Omit<CustomerReview, 'date'>;

        addCustomerReview(payload).tap((value) =>
          value.match({
            Ok: (value) => {
              this.customerReviews.set(value);
            },
            Error: () => {},
          })
        );
      },
      None: () => {},
    });
  }

  render() {
    setChildren(this, this.template);
  }
}

customElements.define(
  RestaurantCustomerReviews.tagName,
  RestaurantCustomerReviews
);

export default RestaurantCustomerReviews;
