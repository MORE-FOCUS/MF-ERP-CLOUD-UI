/*
 * 项目启动入口方法
 */

import { createApp } from 'vue';
import Antd, { message } from 'ant-design-vue';
import * as antIcons from '@ant-design/icons-vue';
import lodash from 'lodash';
import JsonViewer from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import App from './App.vue';
import { smartSentry } from '/@/lib/smart-sentry';
import { loginApi } from '/src/api/system/login-api';
import constantsInfo from '/@/constants/index';
import { privilegeDirective } from '/@/directives/privilege';
import i18n from '/@/i18n/index';
import privilegePlugin from '/@/plugins/privilege-plugin';
import smartEnumPlugin from '/@/plugins/smart-enums-plugin';
import { buildRoutes, router } from '/@/router';
import { store } from '/@/store';
import { useUserStore } from '/@/store/modules/system/user';
import 'ant-design-vue/dist/reset.css';
import '/@/theme/index.less';
import { localRead } from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

/**
 * 获取用户信息和用户权限对应的路由，构建动态路由
 */
async function getLoginInfo() {
  try {
    //获取登录用户信息
    const res = await loginApi.getLoginInfo();
    //构建系统的路由
    let menuRouterList = res.data.menuList.filter((e) => e.path || e.frameUrl);
    buildRoutes(menuRouterList);
    initVue();
    //更新用户信息到pinia
    useUserStore().setUserLoginInfo(res.data);
  } catch (e) {
    message.error(e.data ? e.data.msg : e.message);
    smartSentry.captureError(e);
    initVue();
  }
}

function initVue() {
  let vueApp = createApp(App);
  let app = vueApp.use(router).use(store).use(i18n).use(Antd).use(smartEnumPlugin, constantsInfo).use(privilegePlugin).use(JsonViewer);
  //注入权限
  app.directive('privilege', {
    mounted(el, binding) {
      privilegeDirective(el, binding);
    },
  });
  // 注册图标组件
  Object.keys(antIcons).forEach((key) => {
    app.component(key, antIcons[key]);
  });
  //全局
  app.config.globalProperties.$antIcons = antIcons;
  app.config.globalProperties.$lodash = lodash;
  //挂载
  app.mount('#app');
}

//不需要获取用户信息、用户菜单、用户菜单动态路由，直接初始化vue即可
let token = localRead(LocalStorageKeyConst.USER_TOKEN);
if (!token) {
  initVue();
} else {
  getLoginInfo();
}
