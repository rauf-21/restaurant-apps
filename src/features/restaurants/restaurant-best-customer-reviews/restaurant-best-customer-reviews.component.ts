import { Option } from '@swan-io/boxed';
import { setChildren, setAttr } from 'redom';
import { superstate } from '@superstate/core';
import { replace } from 'feather-icons';
import { match } from 'ts-pattern';

import {
  h1,
  section,
  button,
  div,
  i,
  figure,
  blockquote,
  figcaption,
} from '../../shared/utils/dom-elements';
import { $, $$ } from '../../shared/utils/dom-utils';
import { setAbortableTimeout } from '../../shared/utils/timer-utils';
import './restaurant-best-customer-reviews.style.scss';

/** Click delay to prevent double click which cause the slide to stop while transition */
const SLIDE_PICKER_DELAY = 500;

class RestaurantBestCustomerReviews extends HTMLElement {
  static readonly tagName = 'restaurant-best-customer-reviews';

  private readonly controller = new AbortController();

  private readonly currentSlideIndex = superstate(0).extend({
    setIndex({ set }, index) {
      const slideContainer = $('#restaurant-best-customer-review-slides');

      slideContainer.match({
        Some: (slideContainer) => {
          const minIndex = 0;
          const maxIndex = slideContainer.children.length - 1;
          const newIndex =
            index < minIndex ? minIndex : index > maxIndex ? maxIndex : index; // eslint-disable-line no-nested-ternary

          set(newIndex);
        },
        None: () => {},
      });
    },
  });

  private readonly bestCustomerReviews = [
    {
      name: 'Ben Do',
      review:
        'This cozy restaurant has left the best impressions! Hospitable hosts, delicious dishes, beautiful presentation and wonderful dessert. I recommend to everyone! I would like to come back here again and again.',
      date: '17 July 2022',
      restaurantName: 'Bring Your Phone Cafe',
    },
    {
      name: 'Kuma Kuma',
      review:
        'Do yourself a favor and visit this lovely restaurant. The service is unmatched. The staff truly cares about your experience. The food is absolutely amazing – everything we tasted melted in other mouths. Absolutely the best meal we had. Highly recommend!',
      date: '',
      restaurantName: 'Pangsit Express',
    },
    {
      name: 'Damian Bernardo',
      review:
        'A small local restaurant with great service, food, and overall experience! Huge variety of food to choose from & side dishes are delicious as well.',
      date: '',
      restaurantName: 'Ducky Duck',
    },
  ];

  get template() {
    return [
      h1("Here's what the others say"),
      section(
        {
          id: 'restaurant-best-customer-reviews-carousel',
        },
        [
          button(
            {
              id: 'restaurant-best-customer-review-slide-prev-button',
              class: 'button button--solid',
              type: 'button',
              'aria-label': 'previous slide button',
              onclick: this.handlePrevSlideButtonClick.bind(this),
            },
            [
              i({
                'data-feather': 'chevron-left',
              }),
            ]
          ),
          div(
            {
              id: 'restaurant-best-customer-review-slides-container',
            },
            [
              div(
                { id: 'restaurant-best-customer-review-slides' },
                this.bestCustomerReviews.map((bestCustomerReview) =>
                  figure([
                    blockquote(bestCustomerReview.review),
                    figcaption(
                      `${bestCustomerReview.name} on ${bestCustomerReview.restaurantName}`
                    ),
                  ])
                )
              ),
              div(
                { id: 'carousel-slide-picker-button-container' },
                this.bestCustomerReviews.map((_, index) =>
                  button(
                    {
                      class: `carousel-slide-picker-button ${
                        index === 0 ? 'active' : ''
                      }`,
                      type: 'button',
                      'aria-label': 'slide picker button',
                      onclick: (event: Event) =>
                        this.handleSlidePickerButtonClick(event, index),
                    },
                    [
                      i({
                        'stroke-width': 5,
                        'data-feather': 'circle',
                      }),
                    ]
                  )
                )
              ),
            ]
          ),
          button(
            {
              id: 'restaurant-best-customer-review-slide-next-button',
              class: 'button button--solid',
              type: 'button',
              'aria-label': 'next slide button',
              onclick: this.handleNextSlideButtonClick.bind(this),
            },
            [
              i({
                'data-feather': 'chevron-right',
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

    window.addEventListener('resize', this.handleScreenResize.bind(this), {
      signal: this.controller.signal,
    });
  }

  disconnectedCallback() {
    this.controller.abort();
  }

  swipeSlide(direction: 'left' | 'right', slideWidth: number) {
    const slideContainer = $('#restaurant-best-customer-review-slides');
    const slidePickerButtons = $$('.carousel-slide-picker-button');

    Option.allFromDict({ slideContainer, slidePickerButtons }).match({
      Some: ({ slideContainer, slidePickerButtons }) => {
        match(direction)
          .with('left', () => {
            setAttr(slideContainer, {
              scrollLeft: slideContainer.scrollLeft - slideWidth,
            });
          })
          .with('right', () => {
            setAttr(slideContainer, {
              scrollLeft: slideContainer.scrollLeft + slideWidth,
            });
          })
          .exhaustive();

        slidePickerButtons.forEach((element, index) => {
          if (this.currentSlideIndex.now() === index) {
            element.classList.add('active');
            return;
          }

          element.classList.remove('active');
        });
      },
      None: () => {},
    });
  }

  handlePrevSlideButtonClick(event: Event) {
    const prevSlideButton = event.currentTarget as HTMLButtonElement;
    const slide = $('#restaurant-best-customer-review-slides > figure');
    const currentSlideIndex = this.currentSlideIndex.now();

    setAttr(prevSlideButton, { disabled: true });
    this.currentSlideIndex.setIndex(currentSlideIndex - 1);

    slide.match({
      Some: (slide) => {
        this.swipeSlide('left', slide.clientWidth);

        setAbortableTimeout(
          () => {
            setAttr(prevSlideButton, { disabled: false });
          },
          SLIDE_PICKER_DELAY,
          {
            signal: this.controller.signal,
          }
        );
      },
      None: () => {},
    });
  }

  handleNextSlideButtonClick(event: Event) {
    const nextSlideButton = event.currentTarget as HTMLButtonElement;
    const slide = $('#restaurant-best-customer-review-slides > figure');
    const currentSlideIndex = this.currentSlideIndex.now();

    setAttr(nextSlideButton, { disabled: true });
    this.currentSlideIndex.setIndex(currentSlideIndex + 1);

    slide.match({
      Some: (slide) => {
        this.swipeSlide('right', slide.clientWidth);

        setAbortableTimeout(
          () => {
            setAttr(nextSlideButton, { disabled: false });
          },
          SLIDE_PICKER_DELAY,
          {
            signal: this.controller.signal,
          }
        );
      },
      None: () => {},
    });
  }

  handleSlidePickerButtonClick(
    event: Event,
    currentSlidePickerButtonIndex: number
  ) {
    const slidePickerButton = event.currentTarget as HTMLButtonElement;
    const slide = $('#restaurant-best-customer-review-slides > figure');
    const slideIndexDiff = Math.abs(
      this.currentSlideIndex.now() - currentSlidePickerButtonIndex
    );
    const isSlideIndexDiffNegative =
      this.currentSlideIndex.now() - currentSlidePickerButtonIndex === -1;

    setAttr(slidePickerButton, { disabled: true });
    this.currentSlideIndex.setIndex(currentSlidePickerButtonIndex);

    slide.match({
      Some: (slide) => {
        this.swipeSlide(
          isSlideIndexDiffNegative ? 'right' : 'left',
          slide.clientWidth * slideIndexDiff
        );

        setAbortableTimeout(
          () => {
            setAttr(slidePickerButton, { disabled: false });
          },
          SLIDE_PICKER_DELAY,
          {
            signal: this.controller.signal,
          }
        );
      },
      None: () => {},
    });
  }

  handleScreenResize() {
    $('#restaurant-best-customer-review-slides').match({
      Some: (slideContainer) => {
        const slideWidth =
          slideContainer.children[0]!.clientWidth *
          slideContainer.children.length;

        this.currentSlideIndex.setIndex(0);

        this.swipeSlide('left', slideWidth);
      },
      None: () => {},
    });
  }

  render() {
    setChildren(this, this.template);
    replace();
  }
}

customElements.define(
  RestaurantBestCustomerReviews.tagName,
  RestaurantBestCustomerReviews
);

export default RestaurantBestCustomerReviews;
