import { Future, Result } from '@swan-io/boxed';

import { Restaurant } from '../restaurant.model';

export const mockRestaurant = {
  id: 'fnfn8mytkpmkfw1e867',
  name: 'Makan mudah',
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
};

export function getRestaurant(id: Restaurant['id']) {
  return Future.make<Result<Restaurant, never>>((resolve) => {
    resolve(Result.Ok({ ...mockRestaurant, id }));
  });
}
