<!--
  * 底部：版权、公司等信息
-->
<template>
  <div class="version">
    <a target="_blank" href="javascript:void(0)"> 技术支持：MORE-FOCUS Since 2014-{{ currentYear }} </a>
  </div>
</template>
<script setup>
  import dayjs from 'dayjs';

  const currentYear = dayjs().year();
</script>

<style lang="less" scoped>
  .version {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    a {
      color: rgba(0, 0, 0, 0.45);
    }
    a:hover {
      color: @primary-color;
    }
  }
</style>
