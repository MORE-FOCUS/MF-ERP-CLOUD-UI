<!--
  *  员工 列表
-->

<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row">
      <a-form-item label="关键字" class="smart-query-form-item">
        <a-input style="" v-model:value="params.keywords" placeholder="姓名/手机号" />
      </a-form-item>

      <a-form-item class="smart-query-form-item">
        <a-button type="primary" @click="queryData">
          <template #icon>
            <SearchOutlined />
          </template>
          查询
        </a-button>
        <a-button @click="reset" class="smart-margin-left10">
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
        <a-button @click="showDrawer" type="primary" size="small" v-privilege="'system:employee:add'">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
        <a-button @click="updateEmployeeDepartment" type="primary" size="small" v-privilege="'system:employee:department:update'" :disabled="selectedRowKeys.length == 0">
          <template #icon>
            <EditOutlined />
          </template>
          调整部门
        </a-button>
        <a-button @click="confirmBatchDelete" type="danger" size="small" v-privilege="'system:employee:delete'" :disabled="selectedRowKeys.length == 0">
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.BUSINESS.EMPLOYEE" :refresh="queryData" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->
    <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" size="small"
      :columns="columns" :data-source="tableData" :pagination="false" :loading="tableLoading" :scroll="{ x: 1200 }"
      row-key="employeeId" bordered>
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.dataIndex === 'isDisabled'">
          <a-tag :color="text ? 'error' : 'processing'">{{ text ? '禁用' : '启用' }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'gender'">
          <span>{{ $smartEnumPlugin.getDescByValue('GENDER_ENUM', text) }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'operate'">
          <div class="smart-table-operate">
            <a-button v-privilege="'system:employee:update'" type="link" size="small"
              @click="showDrawer(record)">编辑</a-button>
            <a-button v-privilege="'system:employee:password:reset'" type="link" size="small"
              @click="resetPassword(record.employeeId, record.loginName)">重置密码</a-button>
            <a-button v-privilege="'system:employee:disabled'" type="link"
              @click="updateDisabled(record.employeeId, record.isDisabled)">{{
          record.isDisabled ? '启用' : '禁用'
        }}</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <div class="smart-query-table-page">
      <a-pagination showSizeChanger showQuickJumper show-less-items :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="params.pageSize" v-model:current="params.pageNum" v-model:pageSize="params.pageSize"
        :total="total" @change="queryEmployee" @showSizeChange="queryEmployee" :show-total="showTableTotal" />
    </div>
    <EmployeeFormModal ref="employeeFormModal" @refresh="queryEmployee" @show-account="showAccount" />
    <!-- <EmployeeDepartmentFormModal ref="employeeDepartmentFormModal" @refresh="queryEmployee" /> -->
    <EmployeePasswordDialog ref="employeePasswordDialog" />
  </a-card>
</template>
<script setup>
import _ from 'lodash';
import { computed, createVNode, reactive, ref, watch } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';
import { employeeApi } from '/@/api/system/employee-api';
import { PAGE_SIZE } from '/@/constants/common-const';
import { SmartLoading } from '/@/components/framework/smart-loading';
import EmployeeFormModal from '../employee-form-modal/index.vue';
// import EmployeeDepartmentFormModal from '../employee-department-form-modal/index.vue';
import EmployeePasswordDialog from '../employee-password-dialog/index.vue';
import { PAGE_SIZE_OPTIONS, showTableTotal } from '/@/constants/common-const';
import { smartSentry } from '/@/lib/smart-sentry';
import TableOperator from '/@/components/support/table-operator/index.vue';
import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';

// ----------------------- 以下是字段定义 emits props ---------------------

const props = defineProps({
  deptId: Number,
  breadcrumb: Array,
});

//-------------回显账号密码信息----------
let employeePasswordDialog = ref();
function showAccount(accountName, passWord) {
  employeePasswordDialog.value.showModal(accountName, passWord);
}

// ----------------------- 表格/列表/ 搜索 ---------------------
//字段
const columns = ref([
  {
    title: '姓名',
    dataIndex: 'actualName',
    width: 85,
    align: 'center'
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    ellipsis: true,
    width: 120,
    align: 'center'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 80,
    align: 'center'
  },
  {
    title: '性别',
    dataIndex: 'gender',
    width: 40,
    align: 'center'
  },
  {
    title: '登录账号',
    dataIndex: 'loginName',
    width: 100,
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'isDisabled',
    width: 60,
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operate',
    width: 120,
    align: 'center',
  },
]);
const tableData = ref();

let defaultParams = {
  deptId: undefined,
  isDisabled: false,
  keywords: undefined,
  searchCount: undefined,
  pageNum: 1,
  pageSize: PAGE_SIZE,
  sortItemList: undefined,
};
const params = reactive({ ...defaultParams });
const total = ref(0);

// 搜索重置
function reset() {
  Object.assign(params, defaultParams);
  queryEmployee();
}

const tableLoading = ref(false);
// 查询
async function queryEmployee() {
  tableLoading.value = true;
  try {
    params.deptId = props.deptId;
    let res = await employeeApi.queryEmployee(params);
    for (const item of res.data.list) {
      item.roleNameList = _.join(item.roleNameList, ',');
    }
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

// 根据关键字 查询
async function queryData(allDepartment) {
  tableLoading.value = true;
  try {
    params.pageNum = 1;
    params.deptId = allDepartment ? undefined : props.deptId;
    let res = await employeeApi.queryEmployee(params);
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

watch(
  () => props.deptId,
  () => {
    if (props.deptId !== params.deptId) {
      params.pageNum = 1;
      queryEmployee();
    }
  },
  { immediate: true }
);

// ----------------------- 多选操作 ---------------------

let selectedRowKeys = ref([]);
let selectedRows = ref([]);
// 是否有选中：用于 批量操作按钮的禁用
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

function onSelectChange(keyArray, selectRows) {
  selectedRowKeys.value = keyArray;
  selectedRows.value = selectRows;
}

// 批量删除员工
function confirmBatchDelete() {
  if (!hasSelected.value) {
    message.warning('请选择要删除的员工');
    return;
  }
  const actualNameArray = selectedRows.value.map((e) => e.actualName);
  const employeeIdArray = selectedRows.value.map((e) => e.employeeId);
  Modal.confirm({
    title: '确定要删除如下员工吗?',
    icon: createVNode(ExclamationCircleOutlined),
    content: _.join(actualNameArray, ','),
    okText: '删除',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        await employeeApi.batchDeleteEmployee(employeeIdArray);
        message.success('删除成功');
        queryEmployee();
        selectedRowKeys.value = [];
        selectedRows.value = [];
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

// 批量更新员工部门
const employeeDepartmentFormModal = ref();

function updateEmployeeDepartment() {
  if (!hasSelected.value) {
    message.warning('请选择要调整部门的员工');
    return;
  }
  const employeeIdArray = selectedRows.value.map((e) => e.employeeId);
  employeeDepartmentFormModal.value.showModal(employeeIdArray);
}

// ----------------------- 添加、修改、禁用、重置密码 ------------------------------------

const employeeFormModal = ref(); //组件

// 展示编辑弹窗
function showDrawer(rowData) {
  let params = {
    isDisabled: false,
    deptId: undefined
  };

  if (rowData) {
    params = _.cloneDeep(rowData);
    params.isDisabled = params.isDisabled ? 1 : 0;
  } else if (props.deptId) {
    params.deptId = props.deptId;
  }
  employeeFormModal.value.showDrawer(params);
}

// 重置密码
function resetPassword(id, name) {
  Modal.confirm({
    title: '提醒',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要重置密码吗?',
    okText: '确定',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        let { data: passWord } = await employeeApi.resetPassword(id);
        message.success('重置成功');
        employeePasswordDialog.value.showModal(name, passWord);
        queryEmployee();
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
        await employeeApi.updateDisabled(id);
        message.success(`${isDisabled ? '启用' : '禁用'}成功`);
        queryEmployee();
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
<style scoped lang="less">
.employee-container {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
}

.query-operate {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.btn-group {
  margin: 10px 0;

  .btn {
    margin-right: 8px;
  }
}
</style>
