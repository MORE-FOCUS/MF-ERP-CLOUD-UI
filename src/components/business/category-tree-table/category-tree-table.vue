<!--
  * 目录 表格
-->
<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addCategory()" type="primary" size="small" v-privilege="`${privilegePrefix}category:add`">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
      </div>
      <div class="smart-table-setting-block"></div>
    </a-row>

    <a-table :scroll="{ x: 1000 }" size="small" :dataSource="tableData" :columns="columns" rowKey="categoryId" bordered
      :pagination="false" @expandedRowsChange="changeExand" :expanded-row-keys="expandedRowKeys">
      <template #bodyCell="{ record, column }">
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="addCategory(record.categoryId)" type="link"
              v-privilege="`${privilegePrefix}category:addChild`">增加子分类</a-button>
            <a-button @click="addCategory(undefined, record)" type="link"
              v-privilege="`${privilegePrefix}category:update`">编辑</a-button>
            <a-button @click="confirmDeleteCategory(record.categoryId)" danger type="link"
              v-privilege="`${privilegePrefix}category:delete`">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <!-- <CategoryFormModal ref="formModal" @reloadList="reloadList" /> -->
  </a-card>
</template>
<script setup>
import { Modal, message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
// import CategoryFormModal from './category-form-modal.vue';
import { categoryApi } from '/@/api/business/category/category-api';
import { smartSentry } from '/@/lib/smart-sentry';

const props = defineProps({
  // 分组类型
  categoryType: Number,
  privilegePrefix: {
    type: String,
    default: '',
  },
});

// ------------------------------ 查询 ------------------------------
const tableLoading = ref(false);
const tableData = ref([]);
const columns = reactive([
  {
    title: '编码',
    dataIndex: 'categoryName',
    algin: 'center'
  },
  {
    title: '名称',
    dataIndex: 'categoryName',
    algin: 'center'
  },
  {
    title: '是否默认',
    dataIndex: 'isDefault',
    algin: 'center'
  },
  {
    title: '是否禁用',
    dataIndex: 'isDisabled',
    algin: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sortValue',
    algin: 'center'
  },
  {
    title: '操作',
    dataIndex: 'action',
    algin: 'center',
    width: 200,
  },
]);

async function queryList() {
  try {
    tableLoading.value = true;
    let queryForm = {
      categoryType: props.categoryType,
    };
    let responseModel = await categoryApi.queryTree(queryForm);
    tableData.value = responseModel.data;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    tableLoading.value = false;
  }
}

const expandedRowKeys = ref([]);
function reloadList(pid) {
  queryList();
  if (pid) {
    expandedRowKeys.value.push(pid);
  }
}

onMounted(queryList);
defineExpose({
  queryList,
});

function changeExand(val) {
  expandedRowKeys.value = val;
}

// ------------------------------ 添加 ------------------------------

const formModal = ref();
function addCategory(pid, rowData) {
  formModal.value.showModal(props.categoryType, pid, rowData);
}

// ------------------------------ 删除 ------------------------------

function confirmDeleteCategory(categoryId) {
  Modal.confirm({
    title: '提示',
    content: '确定要删除当前分类吗?',
    okText: '确定',
    okType: 'danger',
    async onOk() {
      deleteCategory(categoryId);
    },
    cancelText: '取消',
    onCancel() { },
  });
}
async function deleteCategory(categoryId) {
  try {
    SmartLoading.show();
    await categoryApi.delete(categoryId);
    message.success('删除成功');
    queryList();
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    SmartLoading.hide();
  }
}
</script>