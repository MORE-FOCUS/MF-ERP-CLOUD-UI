<!--
  * 目录  商品
-->
<template>
  <div>
    <CategoryTreeTable :category-type="CATEGORY_TYPE_ENUM.SPU.value" />
  </div>
</template>
<script setup>
  import CategoryTreeTable from './components/category-tree-table.vue';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
</script>