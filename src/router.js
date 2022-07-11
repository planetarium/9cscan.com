import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import BlockList from "@/views/BlockList";
import Block from "@/views/Block";
import TransactionList from "@/views/TransactionList";
import Transaction from "@/views/Transaction";
import Account from "@/views/Account";
import Avatar from "@/views/Avatar";
import Status from "@/views/Status";

Vue.use(Router)
let router = new Router({
    base: process.env.BASE_URL,
    mode: 'history',
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else if (to.name != from.name) {
            return {x: 0, y: 0}
        }
    },
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index
        },
        {
            path: '/status',
            name: 'status',
            component: Status
        },
        {
            path: '/blocks',
            name: 'blocks',
            component: BlockList
        },
        {
            path: '/blocks/:index',
            name: 'block',
            component: Block
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: TransactionList
        },
        {
            path: '/tx/:id',
            name: 'transaction',
            component: Transaction
        },
        {
            path: '/address/:address',
            name: 'account',
            component: Account
        },
        {
            path: '/avatar/:address',
            name: 'avatar',
            component: Avatar
        },
    ]
})

export default router
