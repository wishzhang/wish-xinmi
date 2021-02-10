import Vue from 'vue';
const config = {
}

Vue.prototype.config = config;

Object.defineProperty(window, 'config', {
    value: config
})

export default config;
