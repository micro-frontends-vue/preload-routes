const APP_NAME = process.env.VUE_APP_NAME;

export default [
  {
    path: `/${APP_NAME}`,
    name: APP_NAME,
    title: APP_NAME,
    redirect: { name: `${APP_NAME}.page-a` },
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: 'page-a',
        name: `${APP_NAME}.page-a`,
        component: () => import('@/views/PageA.vue'),
      },
      {
        path: 'page-b',
        name: `${APP_NAME}.page-b`,
        component: () => import('@/views/PageB.vue'),
      },
    ],
  },
];
