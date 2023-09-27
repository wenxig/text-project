import { RouteRecordRaw } from 'vue-router';
export default <RouteRecordRaw[]>[
  {
    path: '/',
    redirect: "/auth/login",
  }, {
    path: '/auth',
    component: () => import("@p/auth/index.vue"),
    children: [
      {
        path: 'login',
        component: () => import("@p/auth/login/index.vue")
      }, {
        path: 'register',
        component: () => import("@p/auth/register/index.vue")
      }
    ]
  }, {
    path: '/home/:name',
    component: () => import("@p/home/index.vue")
  }
]