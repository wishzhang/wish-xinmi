import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import website from './website'
import BasicContainer from './components/basic-container'
import IndexLayout from './components/index-layout'
import PhotoGallery from './components/photo-gallery'
import {initFilters} from "./init-filters";
import './style/index.less'

// 初始化过滤器
initFilters(Vue);

// 导入vant组件
import { Lazyload } from 'vant';
import {
    Button,
    Form,
    Field,
    Toast,
    NavBar,
    Tabbar,
    TabbarItem,
    IndexBar,
    IndexAnchor,
    CellGroup,
    Cell,
    ContactCard,
    Icon,
    Popover,
    Search,
    List,
    Sticky,
    Dialog,
    Divider,
    Image as VanImage,
    Uploader,
    Row,
    Col,
    ActionSheet,
    Picker,
    Popup
} from 'vant';

Vue.config.productionTip = false

Vue.use(Lazyload);
Vue.use(Button)
Vue.use(Form)
Vue.use(Field)
Vue.use(Toast)
Vue.use(NavBar)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(IndexBar)
Vue.use(IndexAnchor)
Vue.use(CellGroup)
Vue.use(Cell)
Vue.use(ContactCard)
Vue.use(Icon)
Vue.use(Popover)
Vue.use(Search)
Vue.use(List)
Vue.use(Sticky)
Vue.use(Dialog)
Vue.use(VanImage)
Vue.use(Divider)
Vue.use(Uploader)
Vue.use(Row)
Vue.use(Col)
Vue.use(ActionSheet)
Vue.use(Picker)
Vue.use(Popup)


Vue.use(website);

Vue.component('basic-container', BasicContainer)
Vue.component('index-layout', IndexLayout)
Vue.component('photo-gallery', PhotoGallery)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
