<!--
  *组织机构
-->
<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addDepartment()" type="primary" size="small" v-privilege="`system:department:add`">
          <template #icon>
            <PlusOutlined />
          </template>
          新增部门
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.SYSTEM.DEPARTMENT" :refresh="queryTree" />
      </div>
    </a-row>

    <a-table :scroll="{ x: 1000 }" size="small" :dataSource="departmentTreeData" :columns="columns" rowKey="departmentId"
      bordered :pagination="false" @expandedRowsChange="changeExand" :expanded-row-keys="expandedRowKeys">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'isDefault'">
          <a-tag :color="record.isDefault ? 'success' : 'error'">{{ text ? '是' : '否' }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'isDisabled'">
          <a-tag :color="record.isDisabled ? 'success' : 'error'">{{ text ? '是' : '否' }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="addDepartment(record.departmentId)" type="link"
              v-privilege="`system:department:addChild`">新增</a-button>
            <a-button @click="updateDepartment(record)" type="link" v-privilege="`system:department:update`">编辑</a-button>
            <a-button @click="confirmDeleteDepartment(record.departmentId)" danger type="link"
              v-privilege="`system:department:delete`">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <DepartmentFormModal ref="formModal" @reloadList="queryTree" />
  </a-card>
</template>
<script setup>
import _ from 'lodash';
import { Modal, message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import DepartmentFormModal from './components/department-form-modal.vue';
import { departmentApi } from '/@/api/system/department-api';
import { smartSentry } from '/@/lib/smart-sentry';
import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
import TableOperator from '/@/components/support/table-operator/index.vue'
// ------------------------------ 查询 ------------------------------
const columns = reactive([
  {
    title: '名称',
    dataIndex: 'name',
    width: 150,
    align: 'center'
  },
  {
    title: '编码',
    dataIndex: 'code',
    width: 150,
    align: 'center'
  },
  {
    title: '是否默认',
    dataIndex: 'isDefault',
    width: 150,
    align: 'center'
  },
  {
    title: '是否禁用',
    dataIndex: 'isDisabled',
    width: 150,
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sortValue',
    width: 150,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    align: 'center',
    width: 200,
  },
]);

const departmentTreeData = ref([]);

onMounted(queryTree);

// 部门树
async function queryTree() {
  let res = await departmentApi.queryDepartmentTree();
  departmentTreeData.value = res.data;
}
// ------------------------------ 添加 ------------------------------

const formModal = ref();
function addDepartment(pid) {
  let formData = {
    "pid": pid
  }
  formModal.value.showDrawer(formData);
}

function updateDepartment(rowData) {
  formModal.value.showDrawer(rowData);
}

// ------------------------------ 删除 ------------------------------

function confirmDeleteDepartment(departmentId) {
  Modal.confirm({
    title: '提示',
    content: '确定要删除当前部门吗?',
    okText: '确定',
    okType: 'danger',
    async onOk() {
      deleteCategory(departmentId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}
async function deleteCategory(departmentId) {
  try {
    SmartLoading.show();
    await departmentApi.delete(departmentId);
    message.success('删除成功');
    queryTree();
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    SmartLoading.hide();
  }
}
</script>