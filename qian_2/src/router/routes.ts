import { RouteRecordRaw } from 'vue-router';
import Root from '@p/index.vue';
export default <RouteRecordRaw[]>[
  {
    path: '/',
    component: Root
  }, {
    path: '/login',
    component: () => import("@p/login/index.vue")
  }, {
    path: '/register',
    component: () => import("@p/login/index.vue")
  }
]