<!--
  *  客服人员弹窗
-->
<template>
  <a-modal :open="visible" width="600px" title="联系客服人员" :closable="false" :maskClosable="true">
    <a-row><div style="margin-left: 180px;font-weight:bolder">客服(loki)13267175927 ;</div> </a-row>
    <br />
    <div class="app-qr-box">
      <div class="app-qr">
        <img :src="loki" />
        <span class="qr-desc strong"> loki的微信号！ </span>
        <span class="qr-desc"> 骚扰loki :) </span>
      </div>
      <div class="app-qr">
        <img :src="loki" />
        <span class="qr-desc strong"> MF工程师 </span>
        <span class="qr-desc"> 赚钱、代码、生活 </span>
      </div>
      <div class="app-qr">
        <img :src="loki" />
        <span class="qr-desc strong"> MORE-FOCUS 团队 </span>
        <span class="qr-desc"> 官方账号 </span>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="hide">知道了</a-button>
    </template>
  </a-modal>
</template>
<script setup>
  import { ref, reactive, nextTick, computed } from 'vue';
  import loki from '/@/assets/images/morefocus/loki-wechat.jpg';

  defineExpose({
    show,
  });

  const visible = ref(false);
  function show() {
    visible.value = true;
  }
  function hide() {
    visible.value = false;
  }
</script>
<style lang="less" scoped>
  .app-qr-box {
    display: flex;
    height: 170px;
    align-items: center;
    justify-content: space-around;
    .app-qr {
      display: flex;
      align-items: center;
      width: 33%;
      justify-content: center;
      flex-direction: column;
      > img {
        width: 100%;
        max-width: 150px;
        height: 100%;
        max-height: 150px;
      }
      .strong {
        font-weight: 600;
      }
      .qr-desc {
        display: flex;
        align-items: center;
        font-size: 12px;
        text-align: center;
        overflow-x: hidden;
        > img {
          width: 15px;
          height: 18px;
          margin-right: 9px;
        }
      }
    }
  }

  .ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 120px;
    line-height: 120px;
    width: 120px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel :deep(.slick-slide h3) {
    color: #fff;
  }
</style>
