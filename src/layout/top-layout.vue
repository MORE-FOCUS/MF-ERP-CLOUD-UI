<template>
  <a-layout class="admin-layout">
    <a-layout-header class="top-menu" :theme="theme">
      <TopMenu />
    </a-layout-header>

    <a-layout-content id="layoutContent" class="admin-layout-content">
      <div class="page-tag-div" v-show="pageTagFlag">
        <PageTag />
      </div>

      <IframeIndex v-if="iframeNotKeepAlivePageFlag" :key="route.name" :name="route.name" :url="route.meta.frameUrl" />

      <IframeIndex v-for="item in keepAliveIframePages" v-show="route.name == item.name" :key="item.name"
        :name="item.name" :url="item.meta.frameUrl" />

      <div v-show="!iframeNotKeepAlivePageFlag && keepAliveIframePages.every((e) => route.name != e.name)">
        <router-view v-slot="{ Component }">
          <keep-alive :include="keepAliveIncludes">
            <component :is="Component" :key="route.name" />
          </keep-alive>
        </router-view>
      </div>
    </a-layout-content>

    <a-layout-footer class="layout-footer" v-show="footerFlag">
      <smart-footer />
    </a-layout-footer>
    <a-back-top :target="backTopTarget" :visibilityHeight="80" />
  </a-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useAppConfigStore } from '../store/modules/system/app-config';
import PageTag from './components/page-tag/index.vue';
import TopMenu from './components/top-menu/index.vue';
import SmartFooter from './components/smart-footer/index.vue';
import { smartKeepAlive } from './components/smart-keep-alive';
import IframeIndex from '/@/components/framework/iframe/iframe-index.vue';
import watermark from '../lib/smart-watermark';
import { useUserStore } from '/@/store/modules/system/user';
import { useRouter } from 'vue-router';
import { HOME_PAGE_NAME } from '/@/constants/system/home-const';

const windowHeight = ref(window.innerHeight);
const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);
const color = computed(() => {
  let isLight = useAppConfigStore().$state.sideMenuTheme === 'light';
  return {
    color: isLight ? '#001529' : '#FFFFFF',
    background: isLight ? '#FFFFFF' : '#001529',
  };
});

const pageTagFlag = computed(() => useAppConfigStore().$state.pageTagFlag);
const footerFlag = computed(() => useAppConfigStore().$state.footerFlag);
const watermarkFlag = computed(() => useAppConfigStore().$state.watermarkFlag);
const pageWidth = computed(() => useAppConfigStore().$state.pageWidth);
const dueHeight = computed(() => {
  let due = '45px';
  if (useAppConfigStore().$state.pageTagFlag) {
    due = '85px';
  }
  return due;
});

onMounted(() => {
  if (watermarkFlag.value) {
    watermark.set('layoutContent', useUserStore().actualName);
  } else {
    watermark.clear();
  }
});

watch(
  () => watermarkFlag.value,
  (newValue) => {
    if (newValue) {
      watermark.set('layoutContent', useUserStore().actualName);
    } else {
      watermark.clear();
    }
  }
);

//回到顶部
const backTopTarget = () => {
  return document.getElementById('layoutMain');
};

const router = useRouter();
function goHome() {
  router.push({ name: HOME_PAGE_NAME });
}

window.addEventListener('resize', function () {
  windowHeight.value = window.innerHeight;
});

// ----------------------- keep-alive相关 -----------------------
let { route, keepAliveIncludes, iframeNotKeepAlivePageFlag, keepAliveIframePages } = smartKeepAlive();
</script>

<style lang="less" scoped>
.admin-layout {
  min-height: 100%;

  .top-menu {
    padding: 0px;
    height: 48px;
    line-height: 48px;
    width: 100%;
    z-index: 100;
    right: 0px;
    position: fixed;
    background-color: v-bind('color.background');
  }

  .admin-layout-content {
    background-color: inherit;
    min-height: auto;
    position: relative;
    overflow-x: hidden;
    padding: 10px 0;
    width: v-bind(pageWidth);
    margin-top: v-bind(dueHeight);
    margin-left: auto;
    margin-right: auto;

    .page-tag-div {
      position: fixed;
      top: 48px;
      width: v-bind(pageWidth);
      height: 40px;
      line-height: 40px;
      z-index: 11;
    }
  }
}

.layout-footer {
  position: relative;
  padding: 7px 0px;
  display: flex;
  justify-content: center;
}
</style>
