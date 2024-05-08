<!--
  * 供应商 管理
-->
<template>
    <a-row :gutter="24">
        <a-col :span="5">
            <CategoryTree ref="categoryTreeRef" :categoryType="CATEGORY_TYPE_ENUM.WAREHOUSE.value" />
        </a-col>
        <a-col :span="19">
            <WarehouseList :selectedCategoryId="selectedCategoryId" />
        </a-col>
    </a-row>
</template>

<script setup>
import _ from 'lodash';
import { computed, ref } from 'vue';
import CategoryTree from '/@/components/business/category-tree/category-tree.vue';
import WarehouseList from './components/warehouse-list.vue'
import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';

const categoryTreeRef = ref();

//当前选中的目录ID
const selectedCategoryId = computed(() => {
    if (categoryTreeRef.value) {
        let selectedKeys = categoryTreeRef.value.selectedKeys;
        return _.isEmpty(selectedKeys) ? null : selectedKeys[0];
    }
    return null;
});
</script>

<style scoped lang="less">
.height100 {
    height: 100%;
}
</style>