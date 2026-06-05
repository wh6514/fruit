import {createRouter, createWebHistory} from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue'),
            hidden: true,
            meta: {
                title: '登录'
            }
        },
        {
            path: '/',
            component: () => import('../layout/index.vue'),
            redirect: '/dashboard',
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: () => import('../views/Dashboard.vue'),
                    meta: {
                        title: '数据概览',
                        icon: 'Odometer',
                        keepAlive: true
                    }
                },
                {
                    path: '/business',
                    name: 'business',
                    redirect: '/business/inventory',
                    meta: {
                        title: '业务管理',
                        icon: 'ShoppingBag'
                    },
                    children: [
                        {
                            path: '/business/inventory',
                            name: 'fruitInventory',
                            component: () => import('../views/FruitInventory.vue'),
                            meta: {
                                title: '库存管理',
                                icon: 'Box',
                                keepAlive: true
                            }
                        },
                        {
                            path: '/business/purchase',
                            name: 'fruitPurchase',
                            component: () => import('../views/Home.vue'),
                            meta: {
                                title: '采购下单',
                                icon: 'ShoppingCart',
                                keepAlive: true
                            }
                        }
                    ]
                },
                {
                    path: '/system',
                    name: 'system',
                    redirect: '/system/settings',
                    meta: {
                        title: '系统设置',
                        icon: 'Setting'
                    },
                    children: [
                        {
                            path: '/system/settings',
                            name: 'settings',
                            component: () => import('../views/Settings.vue'),
                            meta: {
                                title: '基础设置',
                                icon: 'Tools'
                            }
                        }
                    ]
                }
            ]
        }
    ],
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    if (to.meta.title) {
        document.title = `${to.meta.title} - 鲜果优选后台管理系统`
    }
    
    if (to.meta.requiresAuth) {
        if (userStore.token) {
            next()
        } else {
            next('/login')
        }
    } else {
        next()
    }
})

export default router
