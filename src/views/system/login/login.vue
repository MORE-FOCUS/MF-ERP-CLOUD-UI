<!--
  * 登录
-->
<template>
  <div class="login-container">
    <div class="box-item desc">
      <div class="welcome">
        <p class="welcome-title">观沧海</p>
        <p> 东临碣石，以观沧海。 </p>
        <p> 水何澹澹，山岛竦峙。 </p>
        <p> 树木丛生，百草丰茂。 </p>
        <p> 秋风萧瑟，洪波涌起。 </p>
        <p> 日月之行，若出其中。 </p>
        <p> 星汉灿烂，若出其里。 </p>
        <p> 幸甚至哉，歌以咏志。 </p>
      </div>
    </div>
    <div class="box-item login">
      <img class="login-qr" :src="loginQR" />
      <div class="login-title">账号登录</div>
      <a-form ref="formRef" class="login-form" :model="loginForm" :rules="rules">
        <a-form-item name="loginName">
          <a-input v-model:value.trim="loginForm.loginName" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="loginForm.password" autocomplete="on"
            :type="showPassword ? 'text' : 'password'"/>
        </a-form-item>
        <a-form-item name="captchaCode">
          <a-input class="captcha-input" v-model:value.trim="loginForm.captchaCode" placeholder="请输入验证码" />
          <img class="captcha-img" :src="captchaBase64Image" @click="getCaptcha" />
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="rememberPwd">记住密码</a-checkbox>
        </a-form-item>
        <a-form-item>
          <div class="btn" @click="onLogin">登录</div>
        </a-form-item>
      </a-form>
      <div class="more">
        <div class="title-box">
          <p class="line"></p>
          <p class="title">其他方式登录</p>
          <p class="line"></p>
        </div>
        <div class="login-type">
          <img :src="aliLogin" />
          <img :src="qqLogin" />
          <img :src="googleLogin" />
          <img :src="weiboLogin" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { message } from 'ant-design-vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginApi } from '/@/api/system/login-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { LOGIN_DEVICE_ENUM } from '/@/constants/system/login-device-const';
import { useUserStore } from '/@/store/modules/system/user';
import { localSave } from '/@/utils/local-util.js';
import LocalStorageKeyConst from '/@/constants/local-storage-key-const.js';

import loginQR from '/@/assets/images/login/login-qr.png';


import aliLogin from '/@/assets/images/login/ali-icon.png';
import googleLogin from '/@/assets/images/login/google-icon.png';
import qqLogin from '/@/assets/images/login/qq-icon.png';
import weiboLogin from '/@/assets/images/login/weibo-icon.png';

import { buildRoutes } from '/@/router/index';
import { smartSentry } from '/@/lib/smart-sentry';
import { encryptData } from '/@/lib/encrypt';

//--------------------- 登录表单 ---------------------------------

const loginForm = reactive({
  loginName: 'admin',
  password: '',
  captchaCode: '',
  captchaUuid: '',
  loginDevice: LOGIN_DEVICE_ENUM.PC.value,
});
const rules = {
  loginName: [{ required: true, message: '用户名不能为空' }],
  password: [{ required: true, message: '密码不能为空' }],
  captchaCode: [{ required: true, message: '验证码不能为空' }],
};

const showPassword = ref(false);
const router = useRouter();
const formRef = ref();
const rememberPwd = ref(false);

onMounted(() => {
  document.onkeyup = (e) => {
    if (e.keyCode == 13) {
      onLogin();
    }
  };
});

onUnmounted(() => {
  document.onkeyup = null;
});

//登录
async function onLogin() {
  formRef.value.validate().then(async () => {
    try {
      SmartLoading.show();
      // 密码加密
      let encryptPasswordForm = Object.assign({}, loginForm, {
        password: encryptData(loginForm.password),
      });
      const res = await loginApi.login(encryptPasswordForm);
      stopRefrestCaptchaInterval();
      localSave(LocalStorageKeyConst.USER_TOKEN, res.data.token ? res.data.token : '');
      message.success('登录成功');
      //更新用户信息到pinia
      useUserStore().setUserLoginInfo(res.data);
      //构建系统的路由
      buildRoutes();
      router.push('/home');
    } catch (e) {
      if (e.data && e.data.code !== 0) {
        loginForm.captchaCode = '';
        getCaptcha();
      }
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  });
}

//--------------------- 验证码 ---------------------------------

const captchaBase64Image = ref('');
async function getCaptcha() {
  try {
    let captchaResult = await loginApi.getCaptcha();
    captchaBase64Image.value = captchaResult.data.captchaBase64Image;
    loginForm.captchaUuid = captchaResult.data.captchaUuid;
    beginRefrestCaptchaInterval(captchaResult.data.expireSeconds);
  } catch (e) {
    console.log(e);
  }
}

let refrestCaptchaInterval = null;
function beginRefrestCaptchaInterval(expireSeconds) {
  if (refrestCaptchaInterval === null) {
    refrestCaptchaInterval = setInterval(getCaptcha, (expireSeconds - 5) * 1000);
  }
}

function stopRefrestCaptchaInterval() {
  if (refrestCaptchaInterval != null) {
    clearInterval(refrestCaptchaInterval);
    refrestCaptchaInterval = null;
  }
}

onMounted(getCaptcha);
</script>
<style lang="less" scoped>
@import './login.less';
</style>
