<!--
  * 目录树
-->
<template>
  <a-card class="tree-container" size="small">
    <a-row>
      <a-input v-model:value.trim="keywords" placeholder="请输入分类名称" />
    </a-row>
    <a-row class="sort-flag-row" v-if="props.showMenu">
      <span>
        排序
        <template v-if="showSortFlag"> （越小越靠前） </template>
        ：<a-switch v-model:checked="showSortFlag" />
      </span>
      <a-button type="primary" @click="addTop" size="small" v-privilege="'support:SupplierCatalog:addCategory'">新建</a-button>
    </a-row>
    <a-tree
      v-if="!_.isEmpty(SupplierCatalogTreeData)"
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      class="tree"
      :treeData="SupplierCatalogTreeData"
      :fieldNames="{ title: 'name', key: 'SupplierCatalogId', value: 'SupplierCatalogId' }"
      style="width: 100%; overflow-x: auto"
      :style="[!height ? '' : { height: `${height}px`, overflowY: 'auto' }]"
      :showLine="!props.checkable"
      :checkable="props.checkable"
      :checkStrictly="props.checkStrictly"
      :selectable="!props.checkable"
      :defaultExpandAll="true"
      @select="treeSelectChange"
    >
      <template #title="item">
        <a-popover placement="right" v-if="props.showMenu">
          <template #content>
            <div style="display: flex; flex-direction: column">
              <a-button type="text" @click="addSupplierCatalog(item.dataRef)" v-privilege="'supplier:catalog:add'">添加下级</a-button>
              <a-button type="text" @click="updateSupplierCatalog(item.dataRef)" v-privilege="'support:SupplierCatalog:edit'">修改</a-button>
              <a-button
                type="text"
                v-if="item.SupplierCatalogId !== topSupplierCatalogId"
                @click="deleteSupplierCatalog(item.SupplierCatalogId)"
                v-privilege="'support:SupplierCatalog:delete'"
                >删除</a-button
              >
            </div>
          </template>
          {{ item.name }}
          <!--显示排序字段-->
          <template v-if="showSortFlag">
            <span class="sort-span">({{ item.sort }})</span>
          </template>
        </a-popover>
        <div v-else>{{ item.name }}</div>
      </template>
    </a-tree>
    <div class="no-data" v-else>暂无结果</div>
    <!-- 添加编辑目录弹窗 -->
    <SupplierCatalogFormModal ref="supplierCatalogFormModal" @refresh="refresh" />
  </a-card>
</template>
<script setup>
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { onUnmounted, watch,ref,createVNode, onMounted  } from 'vue';
  import { Modal } from 'ant-design-vue';
  import _ from 'lodash';
  import SupplierCatalogFormModal from './supplier-catalog-form-modal.vue';
  import { supplierCategoryApi } from '/@/api/business/supplier/supplier-category-api';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import SupplierCatalogEmitter from '../supplier-mitt';

  const DEFAULT_PID = 0;

  // ----------------------- 组件参数 ---------------------

  const props = defineProps({
    // 是否可以选中
    checkable: {
      type: Boolean,
      default: false,
    },
    // 父子节点选中状态不再关联
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 树高度 超出出滚动条
    height: Number,
    // 显示菜单
    showMenu: {
      type: Boolean,
      default: true,
    },
  });

  // ----------------------- 目录树的展示 ---------------------
  const topSupplierCatalogId = ref();
  // 所有目录列表
  const SupplierCatalogList = ref([]);
  // 目录树形数据
  const SupplierCatalogTreeData = ref([]);
  // 存放目录id和目录，用于查找
  const idInfoMap = ref(new Map());
  // 是否显示排序字段
  const showSortFlag = ref(false);

  onMounted(() => {
    querySupplierCatalogTree();
  });

  // 刷新
  async function refresh() {
    await querySupplierCatalogTree();
    if (currentSelectedSupplierCatalogId.value) {
      selectTree(currentSelectedSupplierCatalogId.value);
    }
  }

  // 查询目录列表并构建 目录树
  async function querySupplierCatalogTree() {
    let res = await supplierCategoryApi.queryAll();
    let data = res.data;
    SupplierCatalogList.value = data;
    SupplierCatalogTreeData.value = buildSupplierCatalogTree(data, DEFAULT_PID);

    data.forEach((e) => {
      idInfoMap.value.set(e.SupplierCatalogId, e);
    });

    // 默认显示 最顶级ID为列表中返回的第一条数据的ID
    if (!_.isEmpty(SupplierCatalogTreeData.value) && SupplierCatalogTreeData.value.length > 0) {
      topSupplierCatalogId.value = SupplierCatalogTreeData.value[0].SupplierCatalogId;
      selectTree(SupplierCatalogTreeData.value[0].SupplierCatalogId);
    }
  }

  // 构建目录树
  function buildSupplierCatalogTree(data, pid) {
    let children = data.filter((e) => e.pid === pid) || [];
    children = _.sortBy(children, (e) => e.sort);
    children.forEach((e) => {
      e.children = buildSupplierCatalogTree(data, e.SupplierCatalogId);
    });
    updateSupplierCatalogPreIdAndNextId(children);
    return children;
  }

  // 更新树的前置id和后置id
  function updateSupplierCatalogPreIdAndNextId(data) {
    for (let index = 0; index < data.length; index++) {
      if (index === 0) {
        data[index].nextId = data.length > 1 ? data[1].SupplierCatalogId : undefined;
        continue;
      }

      if (index === data.length - 1) {
        data[index].preId = data[index - 1].SupplierCatalogId;
        data[index].nextId = undefined;
        continue;
      }

      data[index].preId = data[index - 1].SupplierCatalogId;
      data[index].nextId = data[index + 1].SupplierCatalogId;
    }
  }

  // ----------------------- 树的选中 ---------------------
  const selectedKeys = ref([]);
  const checkedKeys = ref([]);
  const breadcrumb = ref([]);
  const currentSelectedSupplierCatalogId = ref();
  const selectedSupplierCatalogChildren = ref([]);

  SupplierCatalogEmitter.on('selectTree', selectTree);

  function selectTree(id) {
    selectedKeys.value = [id];
    treeSelectChange(selectedKeys.value);
  }

  function treeSelectChange(idList) {
    if (_.isEmpty(idList)) {
      breadcrumb.value = [];
      selectedSupplierCatalogChildren.value = [];
      return;
    }
    let id = idList[0];
    selectedSupplierCatalogChildren.value = SupplierCatalogList.value.filter((e) => e.pid === id);
    let filterSupplierCatalogList = [];
    recursionFilterSupplierCatalog(filterSupplierCatalogList, id, true);
    breadcrumb.value = filterSupplierCatalogList.map((e) => e.name);
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
      SupplierCatalogTreeData.value = buildSupplierCatalogTree(SupplierCatalogList.value, DEFAULT_PID);
      return;
    }
    let originData = SupplierCatalogList.value.concat();
    if (!originData) {
      return;
    }
    // 筛选出名称符合的目录
    let filterDepartmenet = originData.filter((e) => e.name.indexOf(keywords.value) > -1);
    let filterSupplierCatalogList = [];
    // 循环筛选出的目录 构建目录树
    filterDepartmenet.forEach((e) => {
      recursionFilterSupplierCatalog(filterSupplierCatalogList, e.id, false);
    });

    SupplierCatalogTreeData.value = buildSupplierCatalogTree(filterSupplierCatalogList, DEFAULT_PID);
  }

  // 根据ID递归筛选目录
  function recursionFilterSupplierCatalog(resList, id, unshift) {
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
      recursionFilterSupplierCatalog(resList, info.pid, unshift);
    }
  }

  // ----------------------- 表单操作：添加目录/修改目录/删除目录/上下移动 ---------------------
  const supplierCatalogFormModal = ref();

  // 添加
  function addSupplierCatalog(e) {
    let data = {
      id: 0,
      name: '',
      pid: e.id,
    };
    currentSelectedSupplierCatalogId.value = e.id;
    supplierCatalogFormModal.value.showModal(data);
  }
  // 添加
  function addTop() {
    let data = {
      id: 0,
      name: '',
      pid: 0,
    };
    supplierCatalogFormModal.value.showModal(data);
  }
  // 编辑
  function updateSupplierCatalog(e) {
    currentSelectedSupplierCatalogId.value = e.id;
    supplierCatalogFormModal.value.showModal(e);
  }

  // 删除
  function deleteSupplierCatalog(id) {
    Modal.confirm({
      title: '提醒',
      icon: createVNode(ExclamationCircleOutlined),
      content: '确定要删除该目录吗?',
      okText: '删除',
      okType: 'danger',
      async onOk() {
        SmartLoading.show();
        try {
          // 若删除的是当前的目录 先找到上级目录
          let selectedKey = null;
          if (!_.isEmpty(selectedKeys.value)) {
            selectedKey = selectedKeys.value[0];
            if (selectedKey === id) {
              let selectInfo = SupplierCatalogList.value.find((e) => e.id === id);
              if (selectInfo && selectInfo.pid) {
                selectedKey = selectInfo.pid;
              }
            }
          }
          await supplierCategoryApi.delete(id);
          await querySupplierCatalogTree();
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
      onCancel() {},
    });
  }

  onUnmounted(() => {
    SupplierCatalogEmitter.all.clear();
  });

  // ----------------------- 以下是暴露的方法内容 ----------------------------
  defineExpose({
    querySupplierCatalogTree,
    selectedSupplierCatalogChildren,
    breadcrumb,
    selectedKeys,
    checkedKeys,
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

    .sort-flag-row {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .sort-span {
      margin-left: 5px;
    }
    .no-data {
      margin: 10px;
    }
  }
</style>
