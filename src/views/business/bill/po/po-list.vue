<!--
  * 采购订单
  *
  * @author:    loki
  * @date:      2024-07-04 23:20:21
-->
<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item class="smart-query-form-item">
        <a-input style="width: 250px" v-model:value="queryForm.searchWord" placeholder="按订单号/供应商/业务员查询" />
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <a-space direction="vertical" :size="12">
          <a-range-picker v-model:value="searchDate" :presets="defaultTimeRanges" @change="dateChange" />
        </a-space>
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <SmartEnumSelect enum-name="PO_BILL_STATE_ENUM" v-model:value="queryForm.billState" width="150px" placeholder="订单状态" />
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <SmartEnumSelect enum-name="BILL_AUDIT_STATE_ENUM" v-model:value="queryForm.auditState" width="150px" placeholder="审核状态" />
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
          新增
        </a-button>

        <a-button size="small">
          <template #icon>
            <CheckSquareOutlined />
          </template>
          审核
        </a-button>
        <a-button size="small">
          <template #icon>
            <CloseSquareOutlined />
          </template>
          反审核
        </a-button>
        <a-button size="small">
          <template #icon> <CloseOutlined /> </template>关闭
        </a-button>
        <a-button size="small">
          <template #icon> <CheckOutlined /> </template>启用
        </a-button>
        <a-button size="small">
          <template #icon> <PrinterOutlined /> </template>打印
        </a-button>
        <a-button size="small">
          <template #icon> <DeleteOutlined /> </template>删除
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="null" :refresh="queryData" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <!---------- 表格 begin ----------->
    <a-table
      size="small"
      :dataSource="tableData"
      :columns="columns"
      rowKey="id"
      bordered
      :loading="tableLoading"
      :pagination="false"
      :scroll="{ x: 800 }"
    >
      <template #bodyCell="{ record, index, column }">
        <template v-if="column.dataIndex === 'no'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="showForm(record)" type="link">编辑</a-button>
            <a-button @click="showForm(record)" type="link">删除</a-button>
          </div>
        </template>
        <template v-if="column.dataIndex === 'billState'">
          <span>{{ $smartEnumPlugin.getDescByValue('PO_BILL_STATE_ENUM', record.billState) }}</span>
        </template>
        <template v-if="column.dataIndex === 'billType'">
          <span>{{ $smartEnumPlugin.getDescByValue('BILL_TYPE_ENUM', record.billType) }}</span>
        </template>
        <template v-if="column.dataIndex === 'auditState'">
          <span>{{ $smartEnumPlugin.getDescByValue('BILL_AUDIT_STATE_ENUM', record.auditState) }}</span>
        </template>
        <template v-if="column.dataIndex === 'checkState'">
          <span>{{ $smartEnumPlugin.getDescByValue('BILL_CHECK_STATE_ENUM', record.checkState) }}</span>
        </template>
      </template>
    </a-table>
    <!---------- 表格 end ----------->

    <div class="smart-query-table-page">
      <a-pagination
        showSizeChanger
        showQuickJumper
        show-less-items
        :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize"
        v-model:current="queryForm.pageNum"
        v-model:pageSize="queryForm.pageSize"
        :total="total"
        @change="queryData"
        @showSizeChange="queryData"
        :show-total="(total) => `共${total}条`"
      />
    </div>

    <BillForm ref="formRef" @reloadList="queryData" />
  </a-card>
</template>
<script setup>
  import _ from 'lodash';
  import { convertAmount } from '/@/utils/str-util';
  import { onMounted, reactive, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { billApi } from '/@/api/business/bill/bill-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import BillForm from './components/bill-form.vue';
  import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
  import TableOperator from '/@/components/support/table-operator/index.vue';
  import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
  // ---------------------------- 表格列 ----------------------------

  const columns = ref([
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '订单日期',
      dataIndex: 'billDate',
      align: 'center',
      fixed: 'left',
      width: 120,
    },
    {
      title: '订单号',
      dataIndex: 'billNo',
      align: 'center',
      width: 200,
      fixed: 'left',
    },
    {
      title: '订单类型',
      dataIndex: 'billType',
      align: 'center',
      width: 80,
    },
    {
      title: '订单状态',
      dataIndex: 'billState',
      ellipsis: true,
      align: 'center',
      width: 80,
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      align: 'center',
      width: 200,
    },
    {
      title: '业务员',
      dataIndex: 'salesmanName',
      align: 'center',
      width: 120,
    },
    {
      title: '数量',
      dataIndex: 'totalQuantity',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '购货金额',
      dataIndex: 'totalAmount',
      ellipsis: true,
      align: 'center',
      width: 120,
      customRender: function ({ text }) {
        return convertAmount(text);
      },
    },
    {
      title: '已付金额',
      dataIndex: 'totalPaidAmount',
      ellipsis: true,
      align: 'center',
      width: 120,
      customRender: function ({ text }) {
        return convertAmount(text);
      },
    },
    {
      title: '优惠率',
      dataIndex: 'discountRate',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '优惠金额',
      dataIndex: 'discountAmount',
      ellipsis: true,
      align: 'center',
      width: 120,
      customRender: function ({ text }) {
        return convertAmount(text);
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '对单状态',
      dataIndex: 'checkState',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '制单人',
      dataIndex: 'createByName',
      ellipsis: true,
      align: 'center',
      width: 120,
    },
    {
      title: '制单日期',
      dataIndex: 'createTime',
      ellipsis: true,
      align: 'center',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 90,
    },
  ]);

  // ---------------------------- 查询数据表单和方法 ----------------------------

  const defaultQueryForm = {
    pageNum: 1,
    pageSize: 10,
  };
  // 查询表单form
  const queryForm = reactive({ ...defaultQueryForm });
  // 表格加载loading
  const tableLoading = ref(false);
  // 表格数据
  const tableData = ref([]);
  // 总数
  const total = ref(0);

  // 日期选择
  let searchDate = ref();

  function dateChange(dates, dateStrings) {
    queryForm.startTime = dateStrings[0];
    queryForm.endTime = dateStrings[1];
  }

  // 重置查询条件
  function resetQuery() {
    let pageSize = queryForm.pageSize;
    Object.assign(queryForm, defaultQueryForm);
    queryForm.pageSize = pageSize;
    queryData();
  }

  // 查询数据
  async function queryData() {
    tableLoading.value = true;
    try {
      let queryResult = await billApi.queryPoPage(queryForm);
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
      let res = await billApi.queryPoPage(params);
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
</script>
