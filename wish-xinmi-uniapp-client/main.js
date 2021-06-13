import Vue from 'vue'
import App from './App'
import style from './common/style.js'
import UniAvatar from './components/uni-avatar/uni-avatar.vue'
import UniGalleryNine from './components/uni-gallery-nine/uni-gallery-nine.vue'
import UniGalleryFour from './components/uni-gallery-four/uni-gallery-four.vue'
import UniPopover from './components/uni-popover/uni-popover.vue'
import UniPopoverAdd from './components/uni-popover-add/uni-popover-add.vue'
import uView from "uview-ui"
import ShowToast from './plugins/show-toast.js'


Vue.use(uView)
Vue.use(ShowToast)
Vue.use(UniPopover)
Vue.use(UniPopoverAdd)

Vue.config.productionTip = false

Vue.prototype.$style = style

App.mpType = 'app'

Vue.use(UniAvatar)
Vue.use(UniGalleryNine)
Vue.use(UniGalleryFour)

const app = new Vue({
    ...App
})
app.$mount()
