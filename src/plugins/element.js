import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Loading,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Loading)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

// 全局消息提示
Vue.prototype.$message = Message
