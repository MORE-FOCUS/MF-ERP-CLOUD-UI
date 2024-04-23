<!--
  * 单号
-->
<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item class="smart-query-form-item">
        <a-input style="width: 300px" v-model:value="queryForm.keywords" placeholder="业务" />
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

  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addSerialNumber" type="primary" size="small">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.SUPPORT.SERIAL_NUMBER" :refresh="queryData" />
      </div>
    </a-row>

    <a-table size="small" :loading="tableLoading" bordered class="smart-margin-top10" :dataSource="tableData"
      :columns="columns" rowKey="serialNumberId" :pagination="false">
      <template #bodyCell="{ record, index, column }">
        <template v-if="column.dataIndex === 'no'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="editSerialNumber(record)" v-privilege="'support:serialNumber:generate'"
              type="link">编辑</a-button>
            <a-button @click="showRecord(record.serialNumberId)" v-privilege="'support:serialNumber:record'"
              type="link">查看记录</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize" v-model:current="queryForm.pageNum" v-model:pageSize="queryForm.pageSize"
        :total="total" @change="queryData" @showSizeChange="queryData" :show-total="(total) => `共${total}条`" />
    </div>
  </a-card>

  <!---生成表单--->
  <SerialNumberGenerateFormModal ref="generateForm" @refresh="queryData" />

  <!---生成记录--->
  <SerialNumberRecordList ref="recordList" />
</template>
<script setup>
import { onMounted, ref, reactive } from 'vue';
import SerialNumberGenerateFormModal from './serial-number-generate-form-modal.vue';
import SerialNumberRecordList from './serial-number-record-list.vue';
import { serialNumberApi } from '/@/api/support/serial-number-api';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
import { smartSentry } from '/@/lib/smart-sentry';
import { SmartLoading } from '/@/components/framework/smart-loading';

//------------------------ 表格渲染 ---------------------

const columns = ref([
  {
    title: '序号',
    dataIndex: 'no',
    width: 50,
    align: 'center'
  },
  {
    title: '业务',
    dataIndex: 'businessName',
    align: 'center'
  },
  {
    title: '格式',
    dataIndex: 'format',
    align: 'center'
  },
  {
    title: '循环周期',
    dataIndex: 'ruleType',
    align: 'center'
  },
  {
    title: '初始值',
    dataIndex: 'initNumber',
    align: 'center'
  },
  {
    title: '随机增量',
    dataIndex: 'stepRandomRange',
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center'
  },
  {
    title: '上次产生单号',
    dataIndex: 'lastNumber',
    align: 'center'
  },
  {
    title: '上次产生时间',
    dataIndex: 'lastTime',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 140,
    align: 'center'
  },
]);


// ---------------- 查询数据 -----------------

const queryFormState = {
  keywords: '',
  pageNum: 1,
  pageSize: 10,
};
const queryForm = reactive({ ...queryFormState });
const tableLoading = ref(false);
const tableData = ref([]);
const total = ref(0);

// 重置查询条件
function resetQuery() {
  let pageSize = queryForm.pageSize;
  Object.assign(queryForm, queryFormState);
  queryForm.pageSize = pageSize;
  queryData();
}

async function queryData() {
  try {
    tableLoading.value = true;
    let res = await serialNumberApi.getAll();
    tableData.value = res.data;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

onMounted(queryData);

// ------------------------------ 表格操作列： 新增 ------------------------------
function addSerialNumber() {

}

function editSerialNumber() {

}

// ------------------------------ 表格操作列： 生成 ------------------------------

// ------------------------------ 表格操作列： 查看结果 ------------------------------

const recordList = ref();
function showRecord(serialNumberId) {
  recordList.value.showModal(serialNumberId);
}
</script>
