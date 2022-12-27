import { Future, Result, Option } from '@swan-io/boxed';
import { openDB } from 'idb';

import CONFIG from '../../shared/constants/config';
import { Restaurant, RestaurantPreview } from '../restaurant.model';

const { IDB } = CONFIG;

const db = openDB<Restaurant>(IDB.DATABASE_NAME, IDB.DATABASE_VERSION, {
  upgrade(dbObject) {
    dbObject.createObjectStore(IDB.OBJECT_STORE_NAME.RESTAURANT, {
      keyPath: 'id',
    });
  },
});

export function getAllFavoriteRestaurants() {
  return Future.make<Result<Option<Restaurant[]>, Error>>((resolve) => {
    const controller = new AbortController();

    db.then(
      (db) =>
        db.getAll(IDB.OBJECT_STORE_NAME.RESTAURANT) as Promise<Restaurant[]>
    )
      .then((value) => {
        if (value === undefined || value === null || value.length <= 0) {
          resolve(Result.Ok(Option.None()));
        }

        resolve(Result.Ok(Option.Some(value)));
      })
      .catch((error) => resolve(Result.Error(error)));

    return controller.abort();
  });
}

export function getFavoriteRestaurant(id: Restaurant['id']) {
  return Future.make<Result<Option<RestaurantPreview>, Error>>((resolve) => {
    const controller = new AbortController();

    db.then(
      (db) =>
        db.get(
          IDB.OBJECT_STORE_NAME.RESTAURANT,
          id
        ) as Promise<RestaurantPreview>
    )
      .then((value) => resolve(Result.Ok(Option.fromNullable(value))))
      .catch((error) => resolve(Result.Error(error)));

    return controller.abort();
  });
}

export function isFavoriteRestaurant(id: Restaurant['id']) {
  return Future.make<boolean>((resolve) => {
    const controller = new AbortController();

    getFavoriteRestaurant(id).tapOk((value) => {
      value.match({
        Some: () => resolve(true),
        None: () => resolve(false),
      });
    });

    return controller.abort();
  });
}

export function addRestaurantToFavorite(restaurant: Restaurant) {
  return Future.make<Result<string, Error>>((resolve) => {
    const controller = new AbortController();

    db.then((db) => db.put(IDB.OBJECT_STORE_NAME.RESTAURANT, restaurant))
      .then((value) => resolve(Result.Ok(value as string)))
      .catch((error) => resolve(Result.Error(error)));

    return controller.abort();
  });
}

export function removeRestaurantFromFavorite(id: Restaurant['id']) {
  return Future.make<Result<true, Error>>((resolve) => {
    const controller = new AbortController();

    db.then((db) => db.delete(IDB.OBJECT_STORE_NAME.RESTAURANT, id))
      .then(() => resolve(Result.Ok(true)))
      .catch((error) => resolve(Result.Error(error)));

    return controller.abort();
  });
}
