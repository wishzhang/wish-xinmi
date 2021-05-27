import Vue from 'vue'

const website = {
    refreshTokenTime: 1000 * 60 * 30,
    tokenHeader: 'xinmi-token'
}

Object.defineProperty(website, 'winWidth', {
    get() {
        let winWidth
        if (window.innerWidth) {
            winWidth = window.innerWidth
        } else if ((document.body) && (document.body.clientWidth)) {
            winWidth = document.body.clientWidth
        }
        return winWidth
    }
})

website.install = function (Vue) {
    Vue.prototype.website = website
}

export default website
