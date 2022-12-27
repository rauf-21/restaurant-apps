import { setChildren } from 'redom';
import { Result, Option } from '@swan-io/boxed';
import { screen, fireEvent, waitFor } from '@testing-library/dom';

import { mockRestaurant } from '../__mocks__/restaurant.model';
import { getFavoriteRestaurant } from '../favorite-restaurant-catalogue/favorite-restaurant-idb.model';
import RestaurantDetail from './restaurant-detail.component';

describe('Removing restaurant from favorite', () => {
  beforeAll(async () => {
    window.location.href = `/#/detail/${mockRestaurant.id}`;
    setChildren(document.body, [new RestaurantDetail()]);

    const addToFavoriteButton = await screen.findByText(/add to favorite/i);

    fireEvent.click(addToFavoriteButton);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it("should show the 'remove from favorite' button when the restaurant has been added before", async () => {
    const removeFromFavorite = await screen.findByText(/remove from favorite/i);

    expect(removeFromFavorite).toBeInTheDocument();
  });

  it("should not show the 'add to favorite' button when the restaurant has been added before", async () => {
    await waitFor(() =>
      expect(screen.queryByText(/add to favorite/i)).not.toBeInTheDocument()
    );
  });

  it('should be able to remove restaurant from restaurant', async () => {
    const removeFromFavorite = await screen.findByText(/remove from favorite/i);

    expect(removeFromFavorite).toBeInTheDocument();

    fireEvent.click(removeFromFavorite);

    const favoriteRestaurant = await getFavoriteRestaurant(
      mockRestaurant.id
    ).toPromise();

    expect(favoriteRestaurant).toStrictEqual(Result.Ok(Option.None()));
  });
});
