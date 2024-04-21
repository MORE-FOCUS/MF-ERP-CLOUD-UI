<!--
  * 目录表单
-->
<template>
  <a-modal v-model:open="visible" :title="formState.categoryId ? '编辑类别' : '添加类别'" @ok="handleOk" destroyOnClose>
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="父类" name="pid">
        <CategoryTreeSelect v-model:value="formState.pid" placeholder="请选择父类"
          :categoryType="formState.categoryType" :currentSelectedParentCategoryId="formState.pid" />
      </a-form-item>
      <a-form-item label="名称" name="categoryName">
        <a-input v-model:value.trim="formState.categoryName" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="禁用" name="isDisabled">
        <a-switch v-model:checked="formState.isDisabled" />
      </a-form-item>
      <a-form-item label="默认" name="isDefault">
        <a-switch v-model:checked="formState.isDefault" />
      </a-form-item>
      <a-form-item label="排序 （值越小越靠前！）" name="sortValue">
        <a-input-number style="width: 100%" v-model:value="formState.sortValue" :min="0" placeholder="请输入正整数" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import message from 'ant-design-vue/lib/message';
import { reactive, ref } from 'vue';
import { categoryApi } from '/@/api/business/category/category-api';
import CategoryTreeSelect from '../category-tree-select/index.vue';
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
const defaultCategoryForm = {
  categoryId: undefined,
  categoryType: undefined,
  categoryName: undefined,
  isDisabled: false,
  isDefault: false,
  pid: 0,
  sortValue: 0,
};

let formState = reactive({
  ...defaultCategoryForm,
});

// 表单校验规则
const rules = {
  categoryName: [
    { required: true, message: '名称不能为空' },
    { max: 50, message: '名称不能大于20个字符', trigger: 'blur' },
  ],
};

// 更新表单数据
function updateFormData(data) {
  Object.assign(formState, defaultCategoryForm);
  if (data) {
    Object.assign(formState, data);
  }
  visible.value = true;
}

// 重置表单数据
function resetFormData() {
  Object.assign(formState, defaultCategoryForm);
}

async function handleOk() {
  try {
    await formRef.value.validate();
    if (formState.categoryId) {
      updateCategory();
    } else {
      addCategory();
    }
  } catch (error) {
    message.error('参数验证错误，请仔细填写表单数据!');
  }
}

// ----------------------- form 表单  ajax 操作 ---------------------
//添加目录ajax请求
async function addCategory() {
  SmartLoading.show();
  try {
    await categoryApi.add(formState);
    emits('refresh');
    closeModal();
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
}

//更新目录ajax请求
async function updateCategory() {
  SmartLoading.show();
  try {
    if (formState.pid === formState.categoryId) {
      message.warning('上级菜单不能为自己');
      return;
    }
    await categoryApi.update(formState);
    emits('refresh');
    closeModal();
  } catch (error) {
    smartSentry.captureError(error);
  } finally {
    SmartLoading.hide();
  }
}
</script>
