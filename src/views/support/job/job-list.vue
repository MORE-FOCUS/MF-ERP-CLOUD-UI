<!--
  * 定时任务调度表
  *
  * @author:    loki
  * @date:      2024-01-21 16:37:55
-->
<template>
    <!---------- 查询表单form begin ----------->
    <a-form class="smart-query-form">
        <a-row class="smart-query-form-row">
            <a-form-item label="关键字" class="smart-query-form-item">
                <a-input style="width: 300px" v-model:value="queryForm.keywords" placeholder="任务名称" />
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
                <a-button @click="showForm" type="primary" size="small">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新建
                </a-button>
                <a-button @click="confirmBatchDelete" type="primary" size="small"
                    :disabled="selectedRowKeyList.length == 0">
                    <template #icon>
                        <DeleteOutlined />
                    </template>
                    批量删除
                </a-button>

                <a-button @click="run" type="primary" size="small" :disabled="selectedRowKeyList.length == 0">
                    <template #icon>
                        <TrademarkCircleOutlined />
                    </template>
                    立即执行
                </a-button>
            </div>
            <div class="smart-table-setting-block">
                <TableOperator v-model="columns" :tableId="null" :refresh="queryData" />
            </div>
        </a-row>
        <!---------- 表格操作行 end ----------->

        <!---------- 表格 begin ----------->
        <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="jobId" bordered :loading="tableLoading"
            :pagination="false" :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }">
            <template #bodyCell="{ text, record, column }">
                <template v-if="column.dataIndex === 'concurrent'">
                    <span>{{ text ? '允许' : '禁止' }}</span>
                </template>
                <template v-if="column.dataIndex === 'misfirePolicy'">
                    <span>{{ $smartEnumPlugin.getDescByValue('MISFIRE_POLICY_ENUM', text) }}</span>
                </template>
                <template v-if="column.dataIndex === 'jobGroup'">
                    <span>{{ $smartEnumPlugin.getDescByValue('JOB_GROUP_ENUM', text) }}</span>
                </template>
                <template v-if="column.dataIndex === 'status'">
                    <a-switch v-model:checked="record.status" @change="changeStatus(record)" checked-children="正常"
                        un-checked-children="暂停" />
                    <!-- <a-tag :color="text ? 'processing' : 'error'">{{ text ? '正常' : '暂停' }}</a-tag> -->
                </template>
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

        <JobForm ref="formRef" @reloadList="queryData" />

    </a-card>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { jobApi } from '/@/api/support/job-api';
import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
import { MISFIRE_POLICY_ENUM } from '/@/constants/support/job-const.js';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import JobForm from './job-form.vue';
// ---------------------------- 表格列 ----------------------------

const columns = ref([
    {
        title: '任务名称',
        dataIndex: 'jobName',
        ellipsis: true,
    },
    {
        title: '任务组名',
        dataIndex: 'jobGroup',
        ellipsis: true,
    },
    {
        title: '调用目标字符串',
        dataIndex: 'invokeTarget',
        ellipsis: true,
    },
    {
        title: 'cron执行表达式',
        dataIndex: 'cronExpression',
        ellipsis: true,
    },
    {
        title: '执行错误策略',
        dataIndex: 'misfirePolicy',
        ellipsis: true,
    },
    {
        title: '是否并发执行',
        dataIndex: 'concurrent',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'status',
        ellipsis: true,
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        ellipsis: true
    },
    {
        title: '备注',
        dataIndex: 'remark',
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
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
        let queryResult = await jobApi.queryPage(queryForm);
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
        await jobApi.delete(data.jobId);
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
        await jobApi.batchDelete(selectedRowKeyList.value);
        message.success('删除成功');
        queryData();
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }
}

// ---------------------------- 执行一次 ----------------------------
function run() {
    Modal.confirm({
        title: '提示',
        content: '确定要执行一次该任务?',
        okText: '执行',
        okType: 'danger',
        onOk() {
            requestRunJob();
        },
        cancelText: '取消',
        onCancel() { },
    });
}

function requestRunJob() {
    try {
        SmartLoading.show();
        jobApi.run(selectedRowKeyList.value);
        message.success('执行成功');
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }
}

// ---------------------------- 启用暂停  ----------------------------
function changeStatus(data) {
    Modal.confirm({
        title: '提示',
        content: '确定要' + (data.status ? '启用' : '暂停') + '该任务?',
        okText: '确定',
        okType: 'danger',
        onOk() {
            requestChangeStatus(data);
        },
        cancelText: '取消',
        onCancel() { },
    });
}

function requestChangeStatus(data) {
    try {
        SmartLoading.show();
        jobApi.update(data);
        message.success('执行成功');
    } catch (e) {
        smartSentry.captureError(e);
    } finally {
        SmartLoading.hide();
    }

}
</script>
