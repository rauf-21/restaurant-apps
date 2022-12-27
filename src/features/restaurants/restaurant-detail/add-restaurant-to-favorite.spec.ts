import { Option, Result } from '@swan-io/boxed';
import { setChildren } from 'redom';
import { screen, fireEvent, waitFor } from '@testing-library/dom';

import RestaurantDetail from './restaurant-detail.component';
import { mockRestaurant } from '../__mocks__/restaurant.model';
import { getFavoriteRestaurant } from '../favorite-restaurant-catalogue/favorite-restaurant-idb.model';

jest.mock('../restaurant.model');

describe('Adding restaurant to favorite', () => {
  beforeAll(() => {
    window.location.href = `/#/detail/${mockRestaurant.id}`;
    setChildren(document.body, [new RestaurantDetail()]);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should show the 'add to favorite' button when the restaurant has not been added before", async () => {
    const addToFavoriteButton = await screen.findByText(/add to favorite/i);

    expect(addToFavoriteButton).toBeInTheDocument();
  });

  it("should not show the 'remove from favorite' button when the restaurant has not been added before", async () => {
    await waitFor(() =>
      expect(
        screen.queryByText(/remove from favorite/i)
      ).not.toBeInTheDocument()
    );
  });

  it('should be able to add restaurant to favorite', async () => {
    const addToFavoriteButton = await screen.findByText(/add to favorite/i);

    expect(addToFavoriteButton).toBeInTheDocument();

    fireEvent.click(addToFavoriteButton);

    const favoriteRestaurant = await getFavoriteRestaurant(mockRestaurant.id);

    expect(favoriteRestaurant).toStrictEqual(
      Result.Ok(Option.Some(mockRestaurant))
    );
  });
});
