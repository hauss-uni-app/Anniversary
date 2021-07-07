import Vue from 'vue'
import App from './App'

import store from './store'
import pageHead from './components/page-head.vue'
Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.component('page-head', pageHead)

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
