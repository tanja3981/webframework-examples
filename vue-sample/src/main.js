console.log("main.js");

import Vue from 'vue';
import Vuelidate from 'vuelidate';

Vue.config.productionTip = false;

Vue.use(Vuelidate);

import store from './store';
import router from './router';
import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
