<!--
  * 目录 表格
-->
<template>
  <a-card size="small" :bordered="false" :hoverable="true">
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addCategory()" type="primary" size="small" v-privilege="`business:category:add`">
          <template #icon>
            <PlusOutlined />
          </template>
          新增类目
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.BUSINESS.GOODS_CATEGORY" :refresh="queryTree" />
      </div>
    </a-row>

    <a-table :scroll="{ x: 1000 }" size="small" :dataSource="categoryTreeData" :columns="columns" rowKey="categoryId"
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
            <a-button @click="addCategory(record.categoryId)" type="link"
              v-privilege="`business:category:addChild`">新增</a-button>
            <a-button @click="updateCategory(record)" type="link" v-privilege="`business:category:update`">编辑</a-button>
            <a-button @click="confirmDeleteCategory(record.categoryId)" danger type="link"
              v-privilege="`business:category:delete`">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
    <CategoryFormModal ref="formModal" @reloadList="queryTree" />
  </a-card>
</template>
<script setup>
import _ from 'lodash';
import { Modal, message } from 'ant-design-vue';
import { onMounted, reactive, ref } from 'vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import CategoryFormModal from './components/category-form-modal.vue';
import { categoryApi } from '/@/api/business/category/category-api';
import { smartSentry } from '/@/lib/smart-sentry';
import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
import TableOperator from '/@/components/support/table-operator/index.vue'


const DEFAULT_CATEGORY_PID = 0;
// ------------------------------ 查询 ------------------------------
const columns = reactive([
  {
    title: '名称',
    dataIndex: 'categoryName',
    width: 150,
    align: 'center'
  },
  {
    title: '编码',
    dataIndex: 'categoryCode',
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

const categoryType = CATEGORY_TYPE_ENUM.SPU.value;

const categoryTreeData = ref([]);

onMounted(queryTree);

// 类别树
async function queryTree() {
  let params = {
    categoryType: categoryType,
  };

  let res = await categoryApi.queryAll(params);
  categoryTreeData.value = buildTree(res.data, DEFAULT_CATEGORY_PID);
}

// 构建目录树
function buildTree(data, pid) {
  let children = data.filter((e) => e.pid === pid) || [];
  children = _.sortBy(children, (e) => e.sortValue);
  children.forEach((e) => {
    e.children = buildTree(data, e.categoryId);
  });
  updateCategoryPreIdAndNextId(children);
  return children;
}

// 更新树的前置id和后置id
function updateCategoryPreIdAndNextId(data) {
  for (let index = 0; index < data.length; index++) {
    if (index === 0) {
      data[index].nextId = data.length > 1 ? data[1].categoryId : undefined;
      continue;
    }

    if (index === data.length - 1) {
      data[index].preId = data[index - 1].categoryId;
      data[index].nextId = undefined;
      continue;
    }

    data[index].preId = data[index - 1].categoryId;
    data[index].nextId = data[index + 1].categoryId;
  }
}

// ------------------------------ 添加 ------------------------------

const formModal = ref();
function addCategory(pid) {
  let formData = {
    "pid": pid,
    "categoryType": categoryType
  }
  formModal.value.showDrawer(formData);
}

function updateCategory(rowData) {
  formModal.value.showDrawer(rowData);
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
    queryTree();
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
    SmartLoading.hide();
  }
}
</script>