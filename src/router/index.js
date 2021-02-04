import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Register from '../views/register'
import Frame from '../views/frame/frame'
import Msg from '../views/frame/msg'
import Contact from '../views/frame/contact'
import Mine from '../views/frame/mine'
import ContactAdd from '../views/frame/contact-add'
import ContactInfo from '../views/frame/contact-info'
import ContactConfirm from '../views/frame/contact-confirm'
import Chat from '../views/frame/chat'
import Setting from '../views/setting'
import Discover from '../views/frame/discover'
import Thought from '../views/frame/thought'
import ThoughtSend from '../views/frame/thought-send'
import ThoughtPeople from '../views/frame/thought-people'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/frame',
        redirect: '/frame/msg',
        component: Frame,
        children: [
            {
                path: 'msg',
                component: Msg
            },
            {
                path: 'contact',
                component: Contact
            },
            {
                path: 'discover',
                component: Discover
            },
            {
                path: 'mine',
                component: Mine
            }
        ]
    },
    // 添加联系人
    {
        path: '/contact-add',
        component: ContactAdd
    },
    // 联系人简介
    {
        path: '/contact-info',
        component: ContactInfo
    },
    // 待确认的联系人
    {
        path: '/contact-confirm',
        component: ContactConfirm
    },
    // 聊天窗口
    {
        path: '/chat',
        component: Chat
    },
    // 设置
    {
        path: '/setting',
        component: Setting
    },
    // 朋友圈
    {
        path: '/thought',
        component: Thought
    },
    // 发朋友圈
    {
        path: '/thought-send',
        component: ThoughtSend
    },
    // 我的朋友圈
    {
        path: '/thought-people',
        component: ThoughtPeople
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
