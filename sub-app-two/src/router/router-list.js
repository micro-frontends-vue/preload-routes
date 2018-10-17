const IS_DEV = process.env.NODE_ENV === 'development';
const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: IS_DEV ? '/' : `/${APP_NAME}`,
    name: APP_NAME,
    redirect: { name: `${APP_NAME}.page-a` },
    component: () => import(/* webpackChunkName: "index" */ '@/views/Index.vue'),
    children: [
      {
        path: 'page-a',
        name: `${APP_NAME}.page-a`,
        component: () => import(/* webpackChunkName: "page-a" */ '@/views/PageA.vue'),
      },
      {
        path: 'page-b',
        name: `${APP_NAME}.page-b`,
        component: () => import(/* webpackChunkName: "page-b" */ '@/views/PageB.vue'),
      },
    ],
  },
];
