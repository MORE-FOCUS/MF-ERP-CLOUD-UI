<!--
  * 组织机构树
-->
<template>
  <a-card class="tree-container" size="small">
    <a-row>
      <a-input v-model:value.trim="keywords" placeholder="输入名称过滤" />
    </a-row>
    <a-row class="operate-row">
      <a-button class="operate-row-button" shape="circle" @click="topAdd" size="small"
        v-privilege="'business:department:add'">
        <PlusOutlined />
      </a-button>
      <a-button type="primary" class="operate-row-button" shape="circle" @click="topEdit" size="small"
        v-privilege="'business:department:edit'">
        <EditOutlined />
      </a-button>
      <a-button type="primary" class="operate-row-button" shape="circle" @click="topDelete" size="small"
        v-privilege="'business:department:delete'" danger>
        <DeleteOutlined />
      </a-button>
      <a-button class="operate-row-button" shape="circle" @click="refresh" size="small">
        <SyncOutlined />
      </a-button>
    </a-row>
    <a-tree v-if="!_.isEmpty(departmentTreeData)" 
      class="tree" v-model:selectedKeys="selectedKeys"
      :treeData="departmentTreeData" 
      :fieldNames="{ title: 'name', key: 'id', value: 'id' }"
      blockNode="true" 
      @select="treeSelectChange">
      <template #title="item">
        {{ item.name }}
      </template>
    </a-tree>
    <div class="no-data" v-else>暂无结果</div>
    <!-- 添加编辑组织机构弹窗 -->
    <DepartmentFormModal ref="departmentFormModal" @refresh="refresh" />
  </a-card>
</template>
<script setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { onUnmounted, watch, ref, createVNode, onMounted } from 'vue';
import { Modal } from 'ant-design-vue';
import _ from 'lodash';
import DepartmentFormModal from './department-form-modal.vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import departmentEmitter from './department-mitt';
import { departmentApi } from '/@/api/system/department-api';
import { smartSentry } from '/@/lib/smart-sentry';

const DEFAULT_PID = 0;

// ----------------------- 组件参数 ---------------------
const props = defineProps({
  departmentType: Number,
});

// ----------------------- 组织机构树的展示 ---------------------
const topDepartmentId = ref();
const departmentList = ref([]);
const departmentTreeData = ref([]);
const idInfoMap = ref(new Map());

onMounted(() => {
  queryTree();
});

// 刷新
async function refresh() {
  await queryTree();
  if (currentSelectedDepartmentId.value) {
    selectTree(currentSelectedDepartmentId.value);
  }
}

// 类别树
async function queryTree() {
  let res = await departmentApi.queryAll();
  let data = res.data;
  departmentList.value = data;
  departmentTreeData.value = buildTree(data, DEFAULT_PID);

  data.forEach((e) => {
    idInfoMap.value.set(e.id, e);
  });

  // 默认显示 最顶级ID为列表中返回的第一条数据的ID
  if (!_.isEmpty(departmentTreeData.value) && departmentTreeData.value.length > 0) {
    topDepartmentId.value = departmentTreeData.value[0].id;
    selectTree(topDepartmentId.value);
  }
}

// 构建组织机构树
function buildTree(data, pid) {
  let children = data.filter((e) => e.pid === pid) || [];
  children = _.sortBy(children, (e) => e.sortValue);
  children.forEach((e) => {
    e.children = buildTree(data, e.id);
  });
  updateDepartmentPreIdAndNextId(children);
  return children;
}

// 更新树的前置id和后置id
function updateDepartmentPreIdAndNextId(data) {
  for (let index = 0; index < data.length; index++) {
    if (index === 0) {
      data[index].nextId = data.length > 1 ? data[1].id : undefined;
      continue;
    }

    if (index === data.length - 1) {
      data[index].preId = data[index - 1].id;
      data[index].nextId = undefined;
      continue;
    }

    data[index].preId = data[index - 1].id;
    data[index].nextId = data[index + 1].id;
  }
}

// ----------------------- 树的选中 ---------------------
const selectedKeys = ref([]);
const currentSelectedDepartmentId = ref();
const selectedDepartmentChildren = ref([]);

departmentEmitter.on('selectTree', selectTree);

function selectTree(id) {
  selectedKeys.value = [id];
  treeSelectChange(selectedKeys.value);
}

function treeSelectChange(idList) {
  if (_.isEmpty(idList)) {
    selectedDepartmentChildren.value = [];
    return;
  }

  let id = idList[0];
  currentSelectedDepartmentId.value = id;
  selectedDepartmentChildren.value = departmentList.value.filter((e) => e.pid === id);
  let filterDepartmentList = [];
  recursionFilterDepartment(filterDepartmentList, id, true);
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
    departmentTreeData.value = buildTree(departmentList.value, DEFAULT_PID);
    return;
  }
  let originData = departmentList.value.concat();
  if (!originData) {
    return;
  }

  // 筛选出名称符合的组织机构
  let filterResultList = originData.filter((e) => e.name.indexOf(keywords.value) > -1);
  let treeList = [];

  // 循环筛选出的组织机构 构建组织机构树
  filterResultList.forEach((e) => {
    recursionFilterDepartment(treeList, e.id, false);
  });

  departmentTreeData.value = buildTree(treeList, DEFAULT_PID);
}

// 根据ID递归筛选组织机构
function recursionFilterDepartment(resList, id, unshift) {
  let info = idInfoMap.value.get(id);
  if (!info || resList.some((e) => e.id === id)) {
    return;
  }
  if (unshift) {
    resList.unshift(info);
  } else {
    resList.push(info);
  }
  if (info.pid && info.pid !== 0) {
    recursionFilterDepartment(resList, info.pid, unshift);
  }
}

// ----------------------- 表单操作：添加组织机构/修改组织机构/删除组织机构/上下移动 ---------------------
const departmentFormModal = ref();

// 添加
function topAdd() {
  let data = {
    id: undefined,
    name: '',
    pid: currentSelectedDepartmentId.value,
    isDefault: false,
    departmentType: props.departmentType
  };
  departmentFormModal.value.showModal(data);
}

// 编辑
function topEdit() {
  let e = idInfoMap.value.get(currentSelectedDepartmentId.value);
  departmentFormModal.value.showModal(e);
}

// 删除
function topDelete() {
  let id = currentSelectedDepartmentId.value;
  Modal.confirm({
    title: '提醒',
    icon: createVNode(ExclamationCircleOutlined),
    content: '确定要删除该条数据吗?',
    okText: '删除',
    okType: 'danger',
    async onOk() {
      SmartLoading.show();
      try {
        //删除之后,自动选中上级组织机构
        let selectedKey = null;
        let selectedNode = departmentList.value.find((e) => e.id === id);
        if (selectedNode && selectedNode.pid) {
          selectedKey = selectedNode.pid;
        }

        await departmentApi.delete(id);
        await queryTree();

        // 刷新选中组织机构
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
  departmentEmitter.all.clear();
});

// ----------------------- 以下是暴露的方法内容 ----------------------------
defineExpose({
  queryTree,
  selectedDepartmentChildren,
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
</style>./department-mitt