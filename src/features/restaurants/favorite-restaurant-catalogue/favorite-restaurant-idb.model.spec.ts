import { Result, Option } from '@swan-io/boxed';

import { Restaurant } from '../restaurant.model';
import {
  addRestaurantToFavorite,
  getFavoriteRestaurant,
  removeRestaurantFromFavorite,
  getAllFavoriteRestaurants,
} from './favorite-restaurant-idb.model';

describe('Favorite Restaurant IDB Model', () => {
  const favoriteRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Resto 1',
      description:
        'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.',
      city: 'Medan',
      address: 'Jln. Pandeglang no 19',
      pictureId: '22',
      rating: 3.7,
      categories: [],
      menus: {
        foods: [],
        drinks: [],
      },
      customerReviews: [],
    },
    {
      id: '2',
      name: 'Resto 2',
      description:
        'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure.',
      city: 'Medan',
      address: 'Jln. Pandeglang no 19',
      pictureId: '22',
      rating: 3.7,
      categories: [],
      menus: {
        foods: [],
        drinks: [],
      },
      customerReviews: [],
    },
  ];

  beforeEach(async () => {
    const favoriteRestaurants = await getAllFavoriteRestaurants();

    favoriteRestaurants.tapOk((value) => {
      value.match({
        Some: (restaurants) =>
          restaurants.forEach(async (restaurant) => {
            await removeRestaurantFromFavorite(restaurant.id);
          }),
        None: () => {},
      });
    });
  });

  it('can return restaurant that has been added', async () => {
    favoriteRestaurants.forEach(async (favoriteRestaurant) => {
      await addRestaurantToFavorite(favoriteRestaurant);
    });

    favoriteRestaurants.forEach(async (favoriteRestaurant) => {
      const savedFavoriteRestaurant = await getFavoriteRestaurant(
        favoriteRestaurant.id
      );

      expect(savedFavoriteRestaurant).toStrictEqual(
        Result.Ok(Option.Some(favoriteRestaurant))
      );
    });
  });

  it('can return all of the restaurants that has been added', async () => {
    favoriteRestaurants.forEach(async (favoriteRestaurant) => {
      await addRestaurantToFavorite(favoriteRestaurant);
    });

    const savedFavoriteRestaurants = await getAllFavoriteRestaurants();

    expect(savedFavoriteRestaurants).toStrictEqual(
      Result.Ok(Option.Some(favoriteRestaurants))
    );
  });

  it('can remove restaurant that has been added', async () => {
    favoriteRestaurants.forEach(async (favoriteRestaurant) => {
      await addRestaurantToFavorite(favoriteRestaurant);
    });

    await removeRestaurantFromFavorite(favoriteRestaurants[0]!.id);

    const savedFavoriteRestaurants = await getAllFavoriteRestaurants();

    expect(savedFavoriteRestaurants).toStrictEqual(
      Result.Ok(Option.Some(favoriteRestaurants.slice(1)))
    );
  });
});
