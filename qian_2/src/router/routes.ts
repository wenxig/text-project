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
    path: '/home',
    component: () => import("@p/home/index.vue"),
    children: [{
      path: ":name",
      component: () => import("@p/home/main/index.vue")
    }]
  }, {
    path: "/user",
    component: () => import("@p/home/index.vue"),
    children: [{
      path: "info",
      component: () => import("@p/home/user/info.vue"),
    }, {
      path: "avatar",
      component: () => import("@p/home/user/avatar.vue"),
    }, {
      path: "password",
      component: () => import("@p/home/user/resetPassword.vue"),
    }]
  }, {
    path: '/article',
    component: () => import("@p/article/index.vue"),
    children:[{
      path:'list',
      component: () => import('@p/article/list.vue')
    }]
  }
]