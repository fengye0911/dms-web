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
axios.defaults.baseURL = "http://localhost:9090"
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

let ElTreeGrid = require('element-tree-grid');
Vue.component(ElTreeGrid.name,ElTreeGrid);

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
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("menus");
    sessionStorage.removeItem("token");
  }
  let userId = JSON.parse(sessionStorage.getItem('userId'));
  if (!userId && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
//让ajax携带cookie
axios.defaults.withCredentials=true;
axios.interceptors.request.use(
    config=> {
        if (sessionStorage.getItem("token")) {
            config.headers.common['X-Authorization'] = "Bearer " + sessionStorage.getItem("token");
        }
        return config;
    }
    // },
    // function (error) {
    //     router.push('/login')
    //     return Promise.reject(error)
    //     })
)

// http响应拦截器
axios.interceptors.response.use(data => {
    const code = data.data.code;
    if(code == 70000004) { //未登录
        ElementUI.Message.error("登录信息已失效，请重新登录！")
        store.commit(type.logout())
        router.replace({
            path: '/Login'
            // 登录成功后跳入浏览的当前页面
            // query: {redirect: router.currentRoute.fullPath}
        })
    }

    return data
}, error => {
    loadinginstace.close();
    const code = error.data.code;
    console.debug(code);
    // 此处判断拦截需要处理的错误状态码并处理
    if(code == 70000004) {

    }

    return Promise.reject(error)
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



