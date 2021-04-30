import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login/login'
import Frame from '../views/frame/frame'
import Msg from '../views/frame/msg'
import Contact from '../views/frame/contact'
import Mine from '../views/frame/mine'
import ContactAdd from '../views/frame/contact-add'
import ContactInfoHad from '../views/frame/contact-info-had'
import ContactInfoYet from '../views/frame/contact-info-yet'
import ContactConfirm from '../views/frame/contact-confirm'
import Chat from '../views/frame/chat'
import Setting from '../views/setting'
import Discover from '../views/frame/discover'
import Thought from '../views/frame/thought'
import ThoughtSend from '../views/frame/thought-send'
import ThoughtPeople from '../views/frame/thought-people'
import MineDetail from '../views/frame/mine-detail'
import IndexLayout from '../components/index-layout'
import ForgetPassword from '../views/login/forget-password'
import UserAgreement from '../views/login/user-agreement'
import PrivacyPolicy from '../views/login/privacy-policy.'
import EmailSetting from '../views/email-setting'
import PasswordSetting from '../views/password-setting'
import ContactInfoEdit from '../views/frame/contact-info-edit'

Vue.use(VueRouter)

const routes = [
    /**
     * 登录模块
     */
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    // 隐私政策
    {
        path: '/login/privacy-policy',
        component: PrivacyPolicy
    },
    // 用户协议
    {
        path: '/login/user-agreement',
        component: UserAgreement
    },
    // 找回密码
    {
        path: '/login/forget-password',
        component: ForgetPassword
    },
    /**
     * 其他模块
     */
    {
        path: '/index-layout',
        component: IndexLayout,
        children: [
            // 修改联系人信息
            {
                path: 'contact-info-edit',
                component: ContactInfoEdit
            },
            // 修改密码
            {
                path: 'password-setting',
                component: PasswordSetting
            },
            // 修改邮箱
            {
                path: 'email-setting',
                component: EmailSetting
            },
            {
                path: 'frame',
                redirect: 'frame/msg',
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
                path: 'contact-add',
                component: ContactAdd
            },
            // 联系人简介：已添加为联系人
            {
                path: 'contact-info-had',
                component: ContactInfoHad
            },
            // 联系人简介：还没成为联系人
            {
                path: 'contact-info-yet',
                component: ContactInfoYet
            },
            // 待确认的联系人
            {
                path: 'contact-confirm',
                component: ContactConfirm
            },
            // 聊天窗口
            {
                path: 'chat',
                component: Chat
            },
            // 设置
            {
                path: 'setting',
                component: Setting
            },
            // 朋友圈
            {
                path: 'thought',
                component: Thought
            },
            // 发朋友圈
            {
                path: 'thought-send',
                component: ThoughtSend
            },
            // 我的朋友圈
            {
                path: 'thought-people',
                component: ThoughtPeople
            },
            // 个人信息详情
            {
                path: 'mine-detail',
                component: MineDetail
            }
        ]
    },
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
