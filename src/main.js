// import Vue from 'vue'
import App from "./App.vue";
import Vue from "vue";
import Antd from "ant-design-vue";
import { PlenaModalPlugin } from "plena-vue-sdk";
import "./index.css";
import "ant-design-vue/dist/antd.css";

Vue.config.productionTip = false;

Vue.use(Antd);
Vue.use(PlenaModalPlugin);
//Vue.config.productionTip = false

// const config = {
//   dappToken:
//     "269a0d4e4b338001c220588534ae809bfc6b1a322415f2561e93e08d5446bb352b08d5a2d85b9fac75ad15d72a087c9a95857e4e265ce0e368440733e9a130b9",
//   dappId: "clotfuhlkqlqs7on7o0g",
//   bridgeUrl: "connect.plena.finance",
// };

// Vue.mixin(createToggleMixin(config));

new Vue({
  render: (h) => h(App),
}).$mount("#app");
