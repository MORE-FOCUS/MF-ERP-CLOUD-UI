<!--
  *  layout 多种模式
-->
<template>
  <SideLayout v-if="layout === LAYOUT_ENUM.SIDE.value" />
  <SideExpandLayout v-if="layout === LAYOUT_ENUM.SIDE_EXPAND.value" />
  <TopLayout v-if="layout === LAYOUT_ENUM.TOP.value" />
</template>
<script setup>
import { computed } from 'vue';
import { LAYOUT_ENUM } from '/@/constants/layout-const';
import SideExpandLayout from './side-expand-layout.vue';
import SideLayout from './side-layout.vue';
import TopLayout from './top-layout.vue';
import { useAppConfigStore } from '/@/store/modules/system/app-config';

const layout = computed(() => useAppConfigStore().$state.layout);
</script>
