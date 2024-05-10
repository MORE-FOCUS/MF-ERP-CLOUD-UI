<!--
  * 头部一整行
-->
<template>
  <a-space :size="10">
    <div class="setting">
      <a-input-search @click="search" style="margin-right: 30px; width: 250px" placeholder="搜索：进销存" enter-button="搜索" size="small" />
      <HeaderMessage ref="headerMessage" />
      <a-button type="text" @click="showSetting" class="operate-icon">
        <template #icon><setting-outlined /></template>
      </a-button>
      <a-button type="text" @click="showHelpDoc" v-if="!showHelpDocFlag" class="operate-icon">
        <template #icon><question-circle-outlined/></template>
      </a-button>
    </div>
    <div class="user-space-item">
      <HeaderAvatar />
    </div>
    <HeaderSetting ref="headerSetting" />
  </a-space>
</template>

<script setup>
  import HeaderAvatar from './header-avatar.vue';
  import HeaderSetting from './header-setting.vue';
  import HeaderMessage from './header-message.vue';
  import { useAppConfigStore } from '/@/store/modules/system/app-config';
  import { computed, ref } from 'vue';
  import { theme } from 'ant-design-vue';

  // 设置
  const headerSetting = ref();
  function showSetting() {
    headerSetting.value.show();
  }

  //消息通知
  const headerMessage = ref();
  function showMessage() {
    headerMessage.value.showMessage();
  }

  //帮助文档
  function showHelpDoc() {
    useAppConfigStore().showHelpDoc();
  }

  const showHelpDocFlag = computed(() => {
    return useAppConfigStore().helpDocFlag;
  });

  //搜索
  function search() {
    window.open('https://www.morefocus.cn');
  }

  const { useToken } = theme;
  const { token } = useToken();
</script>

<style lang="less" scoped>
  .user-space-item {
    height: 100%;
    color: inherit;
    padding: 0 12px;
    cursor: pointer;
    align-self: center;

    a {
      color: inherit;

      i {
        font-size: 16px;
      }
    }
  }

  .user-space-item:hover {
    color: v-bind('token.colorPrimary');
    background: @hover-bg-color;
  }

  .setting {
    height: @header-user-height;
    line-height: @header-user-height;
    vertical-align: middle;
    display: flex;
    align-items: center;
  }

  .operate-icon {
    margin-left: 20px;
  }
</style>
