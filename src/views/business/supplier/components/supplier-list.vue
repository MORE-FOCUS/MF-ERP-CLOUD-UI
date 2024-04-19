<!--
  * 供应商
  *
  * @author:    loki
  * @date:      2024-04-09 00:04:56
-->
<template>
    <!---------- 查询表单form begin ----------->
    <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
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
                <a-button @click="showForm" type="primary" size="small">
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
                <TableOperator v-model="columns" :tableId="null" :refresh="queryData" />
            </div>
        </a-row>
        <!---------- 表格操作行 end ----------->

        <!---------- 表格 begin ----------->
        <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="id" bordered :loading="tableLoading"
            :pagination="false" :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }">
            <template #bodyCell="{ text, record, column }">
                <template v-if="column.dataIndex === 'action'">
                    <div class="smart-table-operate">
                        <a-button @click="showForm(record)" type="link">编辑</a-button>
                        <a-button @click="onDelete(record)" danger type="link">删除</a-button>
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

        <SupplierForm ref="formRef" @reloadList="queryData" />

    </a-card>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { supplierApi } from '/@/api/business/supplier/supplier-api';
import { smartSentry } from '/@/lib/smart-sentry';
import SupplierForm from './supplier-form.vue';
// ---------------------------- 表格列 ----------------------------

const columns = ref([
    {
        title: '排序',
        dataIndex: 'sortValue',
        ellipsis: true,
    },
    {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        ellipsis: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        ellipsis: true,
    },
    {
        title: '是否默认',
        dataIndex: 'isDefault',
        ellipsis: true,
    },
    {
        title: '供应商编码',
        dataIndex: 'code',
        ellipsis: true,
    },
    {
        title: '类别id',
        dataIndex: 'categoryId',
        ellipsis: true,
    },
    {
        title: '联系人',
        dataIndex: 'contacts',
        ellipsis: true,
    },
    {
        title: '微信号',
        dataIndex: 'wechat',
        ellipsis: true,
    },
    {
        title: '传真',
        dataIndex: 'tax',
        ellipsis: true,
    },
    {
        title: '初始欠款',
        dataIndex: 'originDebt',
        ellipsis: true,
    },
    {
        title: '欠款',
        dataIndex: 'debt',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: 90,
    },
]);

// ---------------------------- 查询数据表单和方法 ----------------------------

const queryFormState = {
    pageNum: 1,
    pageSize: 10,
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
        let queryResult = await supplierApi.queryPage(queryForm);
        tableData.value = queryResult.data.list;
        total.value = queryResult.data.total;
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        tableLoading.value = false;
    }
}

// 根据关键字 查询
async function queryByKeyword() {
    tableLoading.value = true;
    try {
        params.pageNum = 1;
        let res = await supplierApi.queryPage(params);
        tableData.value = res.data.list;
        total.value = res.data.total;
        // 清除选中
        selectedRowKeys.value = [];
        selectedRows.value = [];
    } catch (error) {
        smartSentry.captureError(error);
    } finally {
        tableLoading.value = false;
    }
}


onMounted(queryData);

// ---------------------------- 添加/修改 ----------------------------
const formRef = ref();

function showForm(data) {
    formRef.value.show(data);
}

// ---------------------------- 单个删除 ----------------------------
//确认删除
function onDelete(data) {
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
        await supplierApi.delete(data.id);
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
        await supplierApi.batchDelete(selectedRowKeyList.value);
        message.success('删除成功');
        queryData();
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }
}
</script>