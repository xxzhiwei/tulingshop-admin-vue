import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
    }
];

export const NOT_FOUND = { path: '*', redirect: '/404', hidden: true };

// 动态调用（非函数），返回一个已resolve的Promise
const productAddOrEdit = import('@/views/pms/product/add-or-edit');

export const asyncRoutes = [
    {
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        alwaysShow: true,
        meta: {
            title: '订单模块',
            icon: 'el-icon-setting'
        },
        children: [
            {
                path: 'order',
                component: () => import('@/views/oms/order'),
                meta: {
                    title: '订单管理'
                },
            },
            {
                path: 'order/detail',
                component: () => import('@/views/oms/order/detail'),
                meta: {
                    title: '订单详情',
                    activeMenu: '/oms/order',
                },
                hidden: true,
            },
        ],
        temporary: true
    },
    {
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        alwaysShow: true,
        meta: {
            title: '商品模块',
            icon: 'el-icon-setting'
        },
        children: [
            {
                path: 'product',
                component: () => import('@/views/pms/product'),
                meta: {
                    title: '商品管理'
                }
            },
            {
                path: 'product/add-or-edit',
                component: () => productAddOrEdit,
                meta: {
                    title: '添加商品',
                    activeMenu: '/pms/product'
                },
                hidden: true,
            },
            {
                path: 'product/add-or-edit/:id',
                component: () => productAddOrEdit,
                meta: {
                    title: '编辑商品',
                    activeMenu: '/pms/product'
                },
                hidden: true,
            },
            {
                path: 'brand',
                component: () => import('@/views/pms/brand'),
                meta: {
                    title: '品牌管理'
                }
            },
            {
                path: 'category',
                component: () => import('@/views/pms/category'),
                meta: {
                    title: '分类管理'
                }
            },
            {
                path: 'attrGroup',
                component: () => import('@/views/pms/attrGroup'),
                meta: {
                    title: '属性分组管理'
                }
            },
            {
                path: 'attr',
                component: () => import('@/views/pms/attr'),
                meta: {
                    title: '属性管理'
                }
            },
        ],
        temporary: true
    },
    {
        path: '/sys',
        component: Layout,
        value: "sys",
        redirect: '/sys/user',
        alwaysShow: true, // will always show the root menu
        name: 'Sys',
        meta: {
            title: '系统管理',
            icon: 'el-icon-setting'
        },
        children: [
            {
                path: 'user',
                component: () => import('@/views/sys/user'),
                value: "sys:user",
                name: 'User',
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: 'permission',
                component: () => import('@/views/sys/permission'),
                value: "sys:permission",
                name: 'Permission',
                meta: {
                    title: '权限管理'
                }
            },
            {
                path: 'role',
                component: () => import('@/views/sys/role'),
                value: "sys:role",
                name: 'Role',
                meta: {
                    title: '角色管理'
                }
            },
            {
                path: 'test1',
                component: () => import('@/views/sys/test1'),
                value: "sys:test1",
                name: 'Test1',
                meta: {
                    title: '测试菜单1'
                }
            }
        ]
    },
    // 404 page must be placed at the end !!!
    // { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;
