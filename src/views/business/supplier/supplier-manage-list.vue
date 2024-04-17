<!--
  * 供应商 管理
-->
<template>
    <div class="height100">
        <a-row :gutter="24" class="height100">
            <a-col :span="6">
                <SupplierCatalogTree ref="supplierCatalogTreeRef" />
            </a-col>
            <a-col :span="18" class="height100">
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
import SupplierCatalogTree from './components/supplier-catalog-tree.vue';
import SupplierList from './components/supplier-list.vue'

const supplierCatalogTreeRef = ref();

//当前选中的目录ID
const selectedCatalogId = computed(() => {
    if (supplierCatalogTreeRef.value) {
        let selectedKeys = supplierCatalogTreeRef.value.selectedKeys;
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