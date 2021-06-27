import { createRouter, createWebHashHistory } from 'vue-router';
// import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/backend',
    name: 'BackEnd',
    component: () => import('@/views/Backend.vue'),
    children: [
      {
        path: 'products',
        component: () => import('@/views/Products.vue'),
      },
      {
        path: 'orders',
        component: () => import('@/views/Orders.vue'),
      },
      {
        path: 'coupons',
        component: () => import('@/views/Coupons.vue'),
      },
    ],
  },
  {
    path: '/backend/:pathMatch(.*)*',
    redirect: { name: 'BackEnd' },
  },
  // {
  //   path: '/:pathMatch(.*)*',
  //   component: () => import(');
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
