const routes = {
  '/': () =>
    import(/* webpackChunkName: "home" */ '../pages/home/home.component'),
  '/detail/:id': () =>
    import(
      /* webpackChunkName: "restaurant-detail" */ '../pages/restaurant-detail/restaurant-detail.component'
    ),
  '/favorite': () =>
    import(
      /* webpackChunkName: "restaurant-favorite" */ '../pages/favorite-restaurants/favorite-restaurants.component'
    ),
};

export default routes;
