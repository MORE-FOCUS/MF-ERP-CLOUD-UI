<template>
  <a-layout class="admin-layout" style="min-height: 100%">
    <a-layout-sider class="side-menu" :width="sideMenuWidth" :collapsed="collapsed" :theme="theme">
      <SideMenu :collapsed="collapsed" />
    </a-layout-sider>

    <a-layout id="layoutMain" :style="`height: ${windowHeight}px`" class="admin-layout-main">
      <a-layout-header class="layout-header">
        <a-row class="layout-header-user" justify="space-between">
          <a-col class="layout-header-left">
            <span class="collapsed-button">
              <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
              <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
            </span>
            <a-tooltip placement="bottom">
              <template #title>首页</template>
              <span class="home-button" @click="goHome">
                <home-outlined class="trigger" />
              </span>
            </a-tooltip>
            <span class="location-breadcrumb">
              <MenuLocationBreadcrumb />
            </span>
          </a-col>
          <a-col class="layout-header-right">
            <HeaderUserSpace />
          </a-col>
        </a-row>
        <PageTag />
      </a-layout-header>

      <a-layout-content id="layoutContent" class="admin-layout-content">
        <IframeIndex v-if="iframeNotKeepAlivePageFlag" :key="route.name" :name="route.name"
          :url="route.meta.frameUrl" />
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
    <a-layout-sider v-show="helpDocFlag" theme="light" :width="180" class="help-doc-sider" :trigger="null"
      style="min-height: 100%">
      <SideHelpDoc />
    </a-layout-sider>
  </a-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useAppConfigStore } from '../store/modules/system/app-config';
import HeaderUserSpace from './components/header-user-space/index.vue';
import MenuLocationBreadcrumb from './components/menu-location-breadcrumb/index.vue';
import PageTag from './components/page-tag/index.vue';
import SideMenu from './components/side-menu/index.vue';
import SmartFooter from './components/smart-footer/index.vue';
import { smartKeepAlive } from './components/smart-keep-alive';
import IframeIndex from '/@/components/framework/iframe/iframe-index.vue';
import watermark from '../lib/smart-watermark';
import { useUserStore } from '/@/store/modules/system/user';
import SideHelpDoc from './components/side-help-doc/index.vue';
import { useRouter } from 'vue-router';
import { HOME_PAGE_NAME } from '/@/constants/system/home-const';

const windowHeight = ref(window.innerHeight);
const sideMenuWidth = computed(() => useAppConfigStore().$state.sideMenuWidth);
const theme = computed(() => useAppConfigStore().$state.sideMenuTheme);
const pageTagFlag = computed(() => useAppConfigStore().$state.pageTagFlag);
const helpDocFlag = computed(() => useAppConfigStore().$state.helpDocFlag);
const footerFlag = computed(() => useAppConfigStore().$state.footerFlag);
const watermarkFlag = computed(() => useAppConfigStore().$state.watermarkFlag);
const dueHeight = computed(() => {
  let due = 40;
  if (useAppConfigStore().$state.pageTagFlag) {
    due = due + 40;
  }
  if (useAppConfigStore().$state.footerFlag) {
    due = due + 40;
  }
  return due;
});

const collapsed = ref(false);

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
:deep(.ant-layout-header) {
  height: auto;
}

:deep(.layout-header) {
  height: auto;
}

.layout-header {
  background: #fff;
  padding: 0;
  z-index: 21;
}

.layout-header-user {
  height: @header-user-height;
  border-bottom: 1px solid #f6f6f6;
}

.layout-header-left {
  display: flex;
  height: @header-user-height;

  .collapsed-button {
    margin-left: 10px;
    line-height: @header-user-height;
  }

  .home-button {
    margin-left: 15px;
    cursor: pointer;
    padding: 0 5px;
    line-height: @header-user-height;
  }

  .home-button:hover {
    background-color: #efefef;
  }

  .location-breadcrumb {
    margin-left: 15px;
    line-height: @header-user-height;
  }
}

.layout-header-right {
  display: flex;
  height: @header-user-height;
}

.layout-container {
  height: calc(100vh - @header-height);
  overflow-x: hidden;
}

.admin-layout {
  .side-menu {
    height: 100vh;
    overflow-x: hidden;
    overflow-y: scroll;

    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }
  }

  .side-menu::-webkit-scrollbar {
    width: 4px;
  }

  .side-menu::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.2);
  }

  .side-menu::-webkit-scrollbar-track {
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .help-doc-sider {
    flex: 0 !important;
    min-width: 100px;
    height: 100vh;
    max-width: 100px;
    width: auto !important;

    &.fixed-side {
      position: fixed;
      height: 100vh;
      right: 0;
      top: 0;
    }
  }

  .virtual-side {
    transition: all 0.2s;
  }

  .virtual-header {
    transition: all 0.2s;
    opacity: 0;

    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0;
    }
  }

  .admin-layout-main {
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .admin-layout-content {
    background-color: inherit;
    min-height: auto;
    position: relative;
    overflow-x: hidden;
    padding: 10px 10px 0px 10px;
    height: calc(100% - v-bind(dueHeight) px);
  }
}

.layout-footer {
  position: relative;
  padding: 7px 0px;
  display: flex;
  justify-content: center;
}
</style>
