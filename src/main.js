import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCircleSlider from 'vue-circle-slider'

Vue.use(VueCircleSlider)
Vue.use(BootstrapVue);

Vue.config.productionTip = false

//---------------------Global Objects to import!---------------------//
//Eventbus for communicating between components
export const EventBus = new Vue();
export const AudioCtx = new AudioContext();
export const AudioCtx2 = new AudioContext();
//------------------------------------------------------------------//

new Vue({
  render: h => h(App),
}).$mount('#app')
