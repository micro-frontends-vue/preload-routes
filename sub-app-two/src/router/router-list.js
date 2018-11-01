const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: `/${APP_NAME}`,
    name: APP_NAME,
    redirect: { name: `${APP_NAME}.page-a` },
    component: () => import(/* webpackChunkName: "app-two" */ '@/views/Index.vue'),
    children: [
      {
        path: 'page-a',
        name: `${APP_NAME}.page-a`,
        component: () => import(/* webpackChunkName: "app-two" */ '@/views/PageA.vue'),
      },
      {
        path: 'page-b',
        name: `${APP_NAME}.page-b`,
        component: () => import(/* webpackChunkName: "app-two" */ '@/views/PageB.vue'),
      },
    ],
  },
];
