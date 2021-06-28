import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import style from './common/style.js'
import UniAvatar from './components/uni-avatar/uni-avatar.vue'
import UniGalleryNine from './components/uni-gallery-nine/uni-gallery-nine.vue'
import UniGalleryFour from './components/uni-gallery-four/uni-gallery-four.vue'
import UniPopover from './components/uni-popover/uni-popover.vue'
import UniPopoverAdd from './components/uni-popover-add/uni-popover-add.vue'
import UniIndexLayout from './components/uni-index-layout/uni-index-layout.vue'
import UniNavbar from './components/uni-navbar/uni-navbar.vue'
import uView from "uview-ui"
import toast from './plugins/toast.js'
import navigateTo from './plugins/navigate-to.js'


Vue.use(uView)
Vue.use(UniPopover)
Vue.use(UniPopoverAdd)
Vue.use(UniNavbar)
Vue.use(UniIndexLayout)

Vue.config.productionTip = false

Vue.prototype.$style = style
Vue.prototype.$toast = toast
Vue.prototype.$navigateTo = navigateTo

App.mpType = 'app'

Vue.use(UniAvatar)
Vue.use(UniGalleryNine)
Vue.use(UniGalleryFour)

const app = new Vue({
	...App,
	store
})
app.$mount()
