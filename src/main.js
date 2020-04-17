import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
/*import Mock from './mock'
Mock.bootstrap();*/

/*全局配置axios*/
import axios from 'axios'
axios.defaults.baseURL = "http://localhost:8080"
Vue.prototype.$http = axios

// 给每次请求添加 sessionId
axios.interceptors.request.use(
    config => { config.headers.SESSIONID = sessionStorage.getItem("sessionId"); return config; },
    error => { return Promise.reject(error); }
)

import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

// 解决页面刷新 动态路由消失
initRoutes()
function initRoutes() {

    if (!sessionStorage.getItem("menus")) {
        return;
    }

    // 避免重复配置路由
    if (router.options.routes.length > 3) {
        return;
    }


    let menus = JSON.parse(sessionStorage.menus);

    //总的动态路由的数组
    let allRoutes = [];
    for (let i = 0; i < menus.length; i++) {
        let pMenu = menus[i];
        // 父级菜单
        let parentMenu = {
            path: "/",
            component: () => import("@/views/Home"),
            name: pMenu.name,
            iconCls: pMenu.icon,
            children: []  // 子级菜单数组
        };
        // 子级菜单对象
        for (let j = 0; j < pMenu.children.length; j++) {
            let cMenu = pMenu.children[j];
            let chidMenu = {
                path: cMenu.url,
                component: () => import("@/views/" + cMenu.component),
                name: cMenu.name
            };
            parentMenu.children.push(chidMenu);
        }
        router.options.routes.push(parentMenu);
        allRoutes.push(parentMenu);
    }
    router.addRoutes(allRoutes);
}


router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')



