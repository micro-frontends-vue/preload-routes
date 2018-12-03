const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: `/${APP_NAME}`,
    name: APP_NAME,
    redirect: { name: `${APP_NAME}.home` },
    component: () => import('./App.vue'),
    children: [
      {
        path: 'home',
        name: `${APP_NAME}.home`,
        component: () => import('./views/Home.vue'),
      },
      {
        path: 'about',
        name: `${APP_NAME}.about`,
        component: () => import('./views/About.vue'),
      },
    ],
  },
];
