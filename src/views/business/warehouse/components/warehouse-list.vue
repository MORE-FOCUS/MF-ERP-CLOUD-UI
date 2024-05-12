<!--
  * 仓库
  *
  * @author:    loki
  * @date:      2024-04-09 00:04:56
-->
<template>
    <!---------- 查询表单form begin ----------->
    <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
            <a-form-item label="关键字" class="smart-query-form-item">
                <a-input class="smart-query-keywords" v-model:value="queryForm.keywords" placeholder="编码/名称" />
            </a-form-item>
            <a-form-item class="smart-query-form-item">
                <a-button type="primary" @click="queryData">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    查询
                </a-button>
                <a-button @click="resetQuery" class="smart-margin-left10">
                    <template #icon>
                        <ReloadOutlined />
                    </template>
                    重置
                </a-button>
            </a-form-item>
        </a-row>
    </a-form>
    <!---------- 查询表单form end ----------->

    <a-card size="small" :bordered="false" :hoverable="true">
        <!---------- 表格操作行 begin ----------->
        <a-row class="smart-table-btn-block">
            <div class="smart-table-operate-block">
                <a-button @click="addSupplier" type="primary" size="small">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新建
                </a-button>
                <a-button @click="confirmBatchDelete" type="danger" size="small"
                    :disabled="selectedRowKeyList.length == 0">
                    <template #icon>
                        <DeleteOutlined />
                    </template>
                    批量删除
                </a-button>
            </div>
            <div class="smart-table-setting-block">
                <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.BUSINESS.WAREHOUSE" :refresh="queryData" />
            </div>
        </a-row>
        <!---------- 表格操作行 end ----------->

        <!---------- 表格 begin ----------->
        <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="id" bordered :loading="tableLoading"
            :pagination="false" :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }">
            <template #bodyCell="{ record, index, column }">
                <template v-if="column.dataIndex === 'no'">
                    {{ index + 1 }}
                </template>
                <template v-if="column.dataIndex === 'isDefault'">
                    <a-tag :color="record.isDefault ? 'processing' : 'error'">{{ record.isDefault ? "是" : "否" }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'isLocked'">
                    <a-tag :color="record.isLocked ? 'processing' : 'error'">{{ record.isLocked ? "是" : "否" }}</a-tag>
                </template>
                <template v-if="column.dataIndex === 'isDisabled'">
                    <a-switch :checked="!record.isDisabled" @change="updateDisabled(record.id, record.isDisabled)"/>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <div class="smart-table-operate">
                        <a-button @click="editSupplier(record)" type="link">编辑</a-button>
                        <a-button @click="deleteSupplier(record)" danger type="link">删除</a-button>
                    </div>
                </template>
            </template>
        </a-table>
        <!---------- 表格 end ----------->

        <div class="smart-query-table-page">
            <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
                :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum"
                v-model:pageSize="queryForm.pageSize" :total="total" @change="queryData" @showSizeChange="queryData"
                :show-total="(total) => `共${total}条`" />
        </div>

        <SupplierFormModel ref="supplierFormModelRef" @reloadList="queryData" />

    </a-card>
</template>
<script setup>
import { onMounted, reactive, ref,createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { warehouseApi } from '/@/api/business/warehouse/warehouse-api';
import { smartSentry } from '/@/lib/smart-sentry';
import SupplierFormModel from './warehouse-form-model.vue';
import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
// ---------------------------- 表格列 ----------------------------

const columns = ref([
    {
        title: '序号',
        dataIndex: 'no',
        width: 50,
        align: 'center'
    },
    {
        title: '编码',
        dataIndex: 'code',
        ellipsis: true,
        align: 'center'
    },
    {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
        align: 'center'
    },
    {
        title: '联系人',
        dataIndex: 'contact',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '电话',
        dataIndex: 'tel',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '默认',
        dataIndex: 'isDefault',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '锁定',
        dataIndex: 'isLocked',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '状态',
        dataIndex: 'isDisabled',
        ellipsis: true,
        align: 'center',
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: 90,
        align: 'center',
    },
]);

const props = defineProps({
    selectedCategoryId: Number
});

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
    pageNum: 1,
    pageSize: 10,
    keywords: undefined,
    isDeleted: 0,
};
// 查询表单form
const queryForm = reactive({ ...queryFormState });
// 表格加载loading
const tableLoading = ref(false);
// 表格数据
const tableData = ref([]);
// 总数
const total = ref(0);

// 重置查询条件
function resetQuery() {
    let pageSize = queryForm.pageSize;
    Object.assign(queryForm, queryFormState);
    queryForm.pageSize = pageSize;
    queryData();
}

// 查询数据
async function queryData() {
    tableLoading.value = true;
    try {
        let queryResult = await warehouseApi.queryPage(queryForm);
        tableData.value = queryResult.data.list;
        total.value = queryResult.data.total;
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        tableLoading.value = false;
    }
}

onMounted(queryData);

// ---------------------------- 添加/修改 ----------------------------
const supplierFormModelRef = ref();

//新增
function addSupplier() {
    let data = {
        categoryId: props.selectedCategoryId,
        categoryType: CATEGORY_TYPE_ENUM.WAREHOUSE.value
    }
    showForm(data);
}

//编辑
function editSupplier(data) {
    data.categoryType = CATEGORY_TYPE_ENUM.WAREHOUSE.value;
    showForm(data);
}

function showForm(data) {
    supplierFormModelRef.value.showDrawer(data);
}

// ---------------------------- 单个删除 ----------------------------
//确认删除
function deleteSupplier(data) {
    Modal.confirm({
        title: '提示',
        content: '确定要删除吗?',
        okText: '删除',
        okType: 'danger',
        onOk() {
            requestDelete(data);
        },
        cancelText: '取消',
        onCancel() { },
    });
}

//请求删除
async function requestDelete(data) {
    SmartLoading.show();
    try {
        await warehouseApi.delete(data.id);
        message.success('删除成功');
        queryData();
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }
}

// ---------------------------- 批量删除 ----------------------------

// 选择表格行
const selectedRowKeyList = ref([]);

function onSelectChange(selectedRowKeys) {
    selectedRowKeyList.value = selectedRowKeys;
}

// 批量删除
function confirmBatchDelete() {
    Modal.confirm({
        title: '提示',
        content: '确定要批量删除这些数据吗?',
        okText: '删除',
        okType: 'danger',
        onOk() {
            requestBatchDelete();
        },
        cancelText: '取消',
        onCancel() { },
    });
}

//请求批量删除
async function requestBatchDelete() {
    try {
        SmartLoading.show();
        await warehouseApi.batchDelete(selectedRowKeyList.value);
        message.success('删除成功');
        queryData();
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }
}


// 禁用 / 启用
function updateDisabled(id, isDisabled) {
  Modal.confirm({
    title: '提醒',
    icon: createVNode(ExclamationCircleOutlined),
    content: `确定要${isDisabled ? '启用' : '禁用'}吗?`,
    okText: '确定',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        await warehouseApi.updateDisabled(id);
        message.success(`${isDisabled ? '启用' : '禁用'}成功`);
        queryData();
      } catch (error) {
        smartSentry.captureError(error);
      } finally {
        SmartLoading.hide();
      }
    },
    cancelText: '取消',
    onCancel() { },
  });
}
</script>
