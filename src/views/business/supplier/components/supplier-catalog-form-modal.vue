<!--
  * 目录表单
-->
<template>
  <a-modal v-model:open="visible" :title="formState.supplierCatalogId ? '编辑目录' : '添加目录'" @ok="handleOk" destroyOnClose>
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="上级目录" name="pid" v-if="formState.pid !== 0">
        <SupplierCatalogTreeSelect ref="supplierCatalogTreeSelect" v-model:value="formState.pid" :defaultValueFlag="false" width="100%" />
      </a-form-item>
      <a-form-item label="目录名称" name="name">
        <a-input v-model:value.trim="formState.name" placeholder="请输入目录名称" />
      </a-form-item>
      <a-form-item label="目录排序 （值越小越靠前！）" name="sortValue">
        <a-input-number style="width: 100%" v-model:value="formState.sortValue" :min="0" placeholder="请输入目录名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
  import message from 'ant-design-vue/lib/message';
  import { reactive, ref } from 'vue';
  import { supplierCategoryApi } from '/@/api/business/supplier/supplier-category-api';
  import SupplierCatalogTreeSelect from './supplier-catalog-tree-select.vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';

  // ----------------------- 对外暴漏 ---------------------

  defineExpose({
    showModal,
  });

  // ----------------------- modal 的显示与隐藏 ---------------------
  const emits = defineEmits(['refresh']);

  const visible = ref(false);
  function showModal(data) {
    visible.value = true;
    updateFormData(data);
  }
  function closeModal() {
    visible.value = false;
    resetFormData();
  }

  // ----------------------- form 表单操作 ---------------------
  const formRef = ref();
  const supplierCatalogTreeSelect = ref();
  const defaultSupplierCatalogForm = {
    id: undefined,
    name: undefined,
    pid: undefined,
    sort: 0,
  };

  let formState = reactive({
    ...defaultSupplierCatalogForm,
  });
  // 表单校验规则
  const rules = {
    pid: [{ required: true, message: '上级目录不能为空' }],
    name: [
      { required: true, message: '目录名称不能为空' },
      { max: 50, message: '目录名称不能大于20个字符', trigger: 'blur' },
    ],
  };
  // 更新表单数据
  function updateFormData(data) {
    Object.assign(formState, defaultSupplierCatalogForm);
    if (data) {
      Object.assign(formState, data);
    }
    visible.value = true;
  }
  // 重置表单数据
  function resetFormData() {
    Object.assign(formState, defaultSupplierCatalogForm);
  }

  async function handleOk() {
    try {
      await formRef.value.validate();
      if (formState.supplierCatalogId) {
        updateSupplierCatalog();
      } else {
        addSupplierCatalog();
      }
    } catch (error) {
      message.error('参数验证错误，请仔细填写表单数据!');
    }
  }

  // ----------------------- form 表单  ajax 操作 ---------------------
  //添加目录ajax请求
  async function addSupplierCatalog() {
    SmartLoading.show();
    try {
      await supplierCategoryApi.add(formState);
      emits('refresh');
      closeModal();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }

  //更新目录ajax请求
  async function updateSupplierCatalog() {
    SmartLoading.show();
    try {
      if (formState.pid === formState.supplierCatalogId) {
        message.warning('上级菜单不能为自己');
        return;
      }
      await supplierCategoryApi.update(formState);
      emits('refresh');
      closeModal();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }
</script>
