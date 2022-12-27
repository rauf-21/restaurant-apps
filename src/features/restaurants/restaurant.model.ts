import { Future, Result } from '@swan-io/boxed';

import RESTAURANT_API_ENDPOINT from '../shared/constants/restaurant-api-endpoint';

export interface Resource {
  name: string;
}

export interface CustomerReview {
  name: string;
  review: string;
  date: string;
}

export interface RestaurantMenus {
  foods: Resource[];
  drinks: Resource[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  pictureId: string;
  categories: Resource[];
  menus: RestaurantMenus;
  rating: number;
  customerReviews: CustomerReview[];
}

export type RestaurantPreview = Pick<
  Restaurant,
  'id' | 'name' | 'description' | 'pictureId' | 'city' | 'rating'
>;

export interface GetAllRestaurantPreviewsResponse {
  restaurants: RestaurantPreview[];
}

export interface GetRestaurantResponse {
  restaurant: Restaurant;
}

export function getAllRestaurantPreviews() {
  return Future.make<Result<RestaurantPreview[], Error>>((resolve) => {
    const controller = new AbortController();

    fetch(RESTAURANT_API_ENDPOINT.LIST, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(({ restaurants }: GetAllRestaurantPreviewsResponse) =>
        resolve(Result.Ok(restaurants))
      )
      .catch((error) => resolve(Result.Error(error)));

    return () => controller.abort();
  });
}

export function getRestaurant(id: Restaurant['id']) {
  return Future.make<Result<Restaurant, Error>>((resolve) => {
    const controller = new AbortController();

    fetch(RESTAURANT_API_ENDPOINT.DETAIL(id), {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(({ restaurant }: GetRestaurantResponse) =>
        resolve(Result.Ok(restaurant))
      )
      .catch((error) => resolve(Result.Error(error)));

    return () => controller.abort();
  });
}

export function addCustomerReview(
  payload: {
    id: Restaurant['id'];
  } & Omit<CustomerReview, 'date'>
) {
  return Future.make<Result<CustomerReview[], Error>>((resolve) => {
    const controller = new AbortController();

    fetch(RESTAURANT_API_ENDPOINT.REVIEW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(({ customerReviews }) => resolve(Result.Ok(customerReviews)))
      .catch((error) => resolve(Result.Error(error)));

    return controller.abort();
  });
}
