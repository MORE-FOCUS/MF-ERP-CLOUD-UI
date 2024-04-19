<!--
  * 供应商 管理
-->
<template>
    <div class="height100">
        <a-row :gutter="24" class="height100">
            <a-col :span="5">
                <CategoryTree ref="categoryTreeRef" :categoryType="CATEGORY_TYPE_ENUM.SUPPLIER.value"/>
            </a-col>
            <a-col :span="19" class="height100">
                <div class="supplier-box height100">
                    <SupplierList :catalogId="selectedCatalogId" />
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import _ from 'lodash';
import { computed, ref } from 'vue';
import CategoryTree from '/@/components/business/category-tree/category-tree.vue';
import SupplierList from './components/supplier-list.vue'
import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';

const categoryTreeRef = ref();

//当前选中的目录ID
const selectedCatalogId = computed(() => {
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

.supplier-box {
    display: flex;
    flex-direction: column;

    .employee {
        flex-grow: 2;
        margin-top: 10px;
    }
}
</style>