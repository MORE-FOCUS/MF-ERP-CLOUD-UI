<!--
  * 类别树
-->
<template>
  <a-card class="tree-container" size="small">
    <a-row>
      <a-input v-model:value.trim="keywords" placeholder="输入名称过滤" />
    </a-row>
    <a-row class="operate-row">
      <a-button class="operate-row-button" shape="circle" @click="topAdd" size="small"
        v-privilege="'business:category:add'">
        <PlusOutlined />
      </a-button>
      <a-button type="primary" class="operate-row-button" shape="circle" @click="topEdit" size="small"
        v-privilege="'business:category:edit'">
        <EditOutlined />
      </a-button>
      <a-button type="primary" class="operate-row-button" shape="circle" @click="topDelete" size="small"
        v-privilege="'business:category:delete'" danger>
        <DeleteOutlined />
      </a-button>
      <a-button class="operate-row-button" shape="circle" @click="refresh" size="small">
        <SyncOutlined />
      </a-button>
    </a-row>
    <a-tree v-if="!_.isEmpty(categoryTreeData)" class="tree" v-model:selectedKeys="selectedKeys"
      :treeData="categoryTreeData" :fieldNames="{ title: 'categoryName', key: 'categoryId', value: 'categoryId' }"
      :showLine="false" :defaultCheckedKeys="1" :defaultExpandAll="true" :blockNode="true" @select="treeSelectChange">
      <template #title="item">
        {{ item.categoryName }}
      </template>
    </a-tree>
    <div class="no-data" v-else>暂无结果</div>
    <!-- 添加编辑目录弹窗 -->
    <CategoryFormModal ref="categoryFormModal" @refresh="refresh" />
  </a-card>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { onUnmounted, watch, ref, createVNode, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import _ from 'lodash';
import CategoryFormModal from './category-form-modal.vue';
import { categoryApi } from '/@/api/business/category/category-api';
import { SmartLoading } from '/@/components/framework/smart-loading';
import categoryEmitter from './category-mitt';
import { smartSentry } from '/@/lib/smart-sentry';

const DEFAULT_CATEGORY_PID = 0;

// ----------------------- 组件参数 ---------------------
const props = defineProps({
  categoryType: Number,
});

// ----------------------- 目录树的展示 ---------------------
const topCategoryId = ref();
const categoryList = ref([]);
const categoryTreeData = ref([]);
const idInfoMap = ref(new Map());

onMounted(() => {
  queryTree();
});

// 刷新
async function refresh() {
  await queryTree();
  if (currentSelectedCategoryId.value) {
    selectTree(currentSelectedCategoryId.value);
  }
}

// 类别树
async function queryTree() {
  let params = {
    categoryType: props.categoryType
  };

  let res = await categoryApi.queryAll(params);
  let data = res.data;
  categoryList.value = data;
  categoryTreeData.value = buildTree(data, DEFAULT_CATEGORY_PID);

  data.forEach((e) => {
    idInfoMap.value.set(e.categoryId, e);
  });

  // 默认显示 最顶级ID为列表中返回的第一条数据的ID
  if (!_.isEmpty(categoryTreeData.value) && categoryTreeData.value.length > 0) {
    topCategoryId.value = categoryTreeData.value[0].categoryId;
    selectTree(topCategoryId.value);
  }
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

// ----------------------- 树的选中 ---------------------
const selectedKeys = ref([]);
const currentSelectedCategoryId = ref();
const selectedCategoryChildren = ref([]);

categoryEmitter.on('selectTree', selectTree);

function selectTree(id) {
  selectedKeys.value = [id];
  treeSelectChange(selectedKeys.value);
}

function treeSelectChange(idList) {
  if (_.isEmpty(idList)) {
    selectedCategoryChildren.value = [];
    return;
  }

  let id = idList[0];
  currentSelectedCategoryId.value = id;
  selectedCategoryChildren.value = categoryList.value.filter((e) => e.pid === id);
  let filterCategoryList = [];
  recursionFilterCategory(filterCategoryList, id, true);
}

// -----------------------  筛选 ---------------------
const keywords = ref('');
watch(
  () => keywords.value,
  () => {
    onSearch();
  }
);

// 筛选
function onSearch() {
  if (!keywords.value) {
    categoryTreeData.value = buildTree(categoryList.value, DEFAULT_CATEGORY_PID);
    return;
  }
  let originData = categoryList.value.concat();
  if (!originData) {
    return;
  }

  // 筛选出名称符合的目录
  let filterResultList = originData.filter((e) => e.categoryName.indexOf(keywords.value) > -1);
  let treeList = [];

  // 循环筛选出的目录 构建目录树
  filterResultList.forEach((e) => {
    recursionFilterCategory(treeList, e.categoryId, false);
  });

  categoryTreeData.value = buildTree(treeList, DEFAULT_CATEGORY_PID);
}

// 根据ID递归筛选目录
function recursionFilterCategory(resList, id, unshift) {
  let info = idInfoMap.value.get(id);
  if (!info || resList.some((e) => e.categoryId === id)) {
    return;
  }
  if (unshift) {
    resList.unshift(info);
  } else {
    resList.push(info);
  }
  if (info.pid && info.pid !== 0) {
    recursionFilterCategory(resList, info.pid, unshift);
  }
}

// ----------------------- 表单操作：添加目录/修改目录/删除目录/上下移动 ---------------------
const categoryFormModal = ref();

// 添加
function topAdd() {
  let data = {
    categoryId: undefined,
    categoryName: '',
    pid: currentSelectedCategoryId.value,
    isDefault: false,
    categoryType: props.categoryType
  };
  categoryFormModal.value.showModal(data);
}

// 编辑
function topEdit() {
  let e = idInfoMap.value.get(currentSelectedCategoryId.value);
  categoryFormModal.value.showModal(e);
}

// 删除
function topDelete() {
  let id = currentSelectedCategoryId.value;
  Modal.confirm({
    title: '提醒',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除该类别吗?',
    okText: '删除',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        //删除之后,自动选中上级目录
        let selectedKey = null;
        let selectedNode = categoryList.value.find((e) => e.categoryId === id);
        if (selectedNode && selectedNode.pid) {
          selectedKey = selectedNode.pid;
        }

        await categoryApi.delete(id);
        await queryTree();

        // 刷新选中目录
        if (selectedKey) {
          selectTree(selectedKey);
        }
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

onUnmounted(() => {
  categoryEmitter.all.clear();
});

// ----------------------- 以下是暴露的方法内容 ----------------------------
defineExpose({
  queryTree,
  selectedCategoryChildren,
  selectedKeys,
  keywords,
});
</script>
<style scoped lang="less">
.tree-container {
  height: 100%;

  .tree {
    height: 618px;
    margin-top: 10px;
    overflow-x: hidden;
  }

  .operate-row {
    display: flex;
    justify-content: right;
    margin-top: 5px;
    margin-bottom: 10px;
  }

  .operate-row-button {
    margin-left: 10px;
  }

  .no-data {
    margin: 10px;
  }
}
</style>