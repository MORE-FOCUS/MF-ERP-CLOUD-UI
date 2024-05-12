<template>
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="关键字" class="smart-query-form-item">
        <a-input class="smart-query-keywords" v-model:value="queryForm.keywords" placeholder="名称" />
      </a-form-item>
      <a-form-item class="smart-query-form-item">
        <a-button type="primary" @click="queryData">
          <template #icon>
            <SearchOutlined />
          </template>
          查询
        </a-button>
        <a-button class="smart-margin-left10" @click="resetQuery">
          <template #icon>
            <ReloadOutlined />
          </template>
          重置
        </a-button>
      </a-form-item>
    </a-row>
  </a-form>

  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addUnit" type="primary" size="small">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button @click="confirmBatchDelete" type="danger" size="small" :disabled="selectedRowKeyList.length == 0">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.BUSINESS.UNIT" :refresh="queryData" />
      </div>
    </a-row>
    <!---------- 表格 begin ----------->
    <a-table
      size="small"
      :dataSource="tableData"
      :columns="columns"
      rowKey="id"
      bordered
      :loading="tableLoading"
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }"
    >
      <template #bodyCell="{ record, index, column }">
        <template v-if="column.dataIndex === 'no'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'isDisabled'">
          <a-switch :checked="!record.isDisabled" @change="updateDisabled(record.id, record.isDisabled)" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="editUnit(record)" type="link">编辑</a-button>
            <a-button @click="deleteUnit(record)" danger type="link">删除</a-button>
          </div>
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

    <UnitFormModel ref="unitFormModelRef" @reloadList="queryData" />
  </a-card>
</template>
<script setup>
  import { reactive, ref, onMounted, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { message, Modal } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { unitApi } from '/@/api/business/unit/unit-api';
  import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
  import TableOperator from '/@/components/support/table-operator/index.vue';
  import UnitFormModel from './components/unit-form-model.vue';
  const columns = ref([
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isDisabled',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
    },
  ]);

  const defaultQueryForm = {
    pageNum: 1,
    pageSize: 10,
    keywords: undefined,
    isDeleted: 0,
  };
  const queryForm = reactive({ ...defaultQueryForm });
  const tableLoading = ref(false);
  const tableData = ref([]);
  const total = ref(0);

  function resetQuery() {
    Object.assign(queryForm, defaultQueryForm);
    queryForm.pageSize = queryForm.pageSize;
    queryData();
  }

  async function queryData() {
    tableLoading.value = true;
    try {
      let queryResult = await unitApi.queryPage(queryForm);
      tableData.value = queryResult.data.list;
      total.value = queryResult.data.total;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  onMounted(queryData);

  //新增
  function addUnit() {
    showForm();
  }

  //编辑
  function editUnit(data) {
    showForm(data);
  }

  const unitFormModelRef = ref();

  function showForm(data) {
    unitFormModelRef.value.showDrawer(data);
  }

  // ---------------------------- 单个删除 ----------------------------
  //确认删除
  function deleteUnit(data) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除吗?',
      okText: '删除',
      okType: 'danger',
      onOk() {
        requestDelete(data);
      },
      cancelText: '取消',
      onCancel() {},
    });
  }

  //请求删除
  async function requestDelete(data) {
    SmartLoading.show();
    try {
      await unitApi.delete(data.id);
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
      onCancel() {},
    });
  }

  //请求批量删除
  async function requestBatchDelete() {
    try {
      SmartLoading.show();
      await unitApi.batchDelete(selectedRowKeyList.value);
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
          await unitApi.updateDisabled(id);
          message.success(`${isDisabled ? '启用' : '禁用'}成功`);
          queryData();
        } catch (error) {
          smartSentry.captureError(error);
        } finally {
          SmartLoading.hide();
        }
      },
      cancelText: '取消',
      onCancel() {},
    });
  }
</script>
<style scoped></style>
