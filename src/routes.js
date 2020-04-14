import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import echarts from './views/charts/echarts.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '首页',
        iconCls: 'fa fa-chrome',//图标样式class
        leaf: true, //只有一个节点,
        hidden: false,
        children: [
            {path: '/main', component: echarts, name: '首页'}
        ]
    }
];

export default routes;