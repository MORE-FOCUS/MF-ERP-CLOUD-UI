<!--
  * 组织机构表单 弹窗
-->
<template>
  <a-modal v-model:open="visible" :title="formState.pid ? '编辑组织机构' : '添加组织机构'" @ok="handleOk" destroyOnClose>
    <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
      <a-form-item label="上级组织机构" name="pid" v-if="formState.pid != 0">
        <DepartmentTreeSelect ref="departmentTreeSelect" v-model:value="formState.pid" :defaultValueFlag="false" width="100%" />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input v-model:value.trim="formState.name" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="组织机构负责人" name="managerId">
        <EmployeeSelect ref="employeeSelect" placeholder="请选择负责人" width="100%" v-model:value="formState.managerId" :leaveFlag="false" />
      </a-form-item>
      <a-form-item label="组织机构排序 （值越大越靠前！）" name="sortValue">
        <a-input-number style="width: 100%" v-model:value="formState.sortValue" :min="0" placeholder="请输入名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
  import message from 'ant-design-vue/lib/message';
  import { reactive, ref } from 'vue';
  import { departmentApi } from '/@/api/system/department-api';
  import DepartmentTreeSelect from '/@/components/system/department-tree-select/index.vue';
  import EmployeeSelect from '/@/components/system/employee-select/index.vue';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { SmartLoading } from '/@/components/framework/smart-loading';

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
  const departmentTreeSelect = ref();
  const defaultDepartmentForm = {
    id: undefined,
    managerId: undefined,
    name: undefined,
    pid: undefined,
    sortValue: 0,
  };
  const employeeSelect = ref();

  let formState = reactive({
    ...defaultDepartmentForm,
  });
  // 表单校验规则
  const rules = {
    pid: [{ required: true, message: '上级组织机构不能为空' }],
    name: [
      { required: true, message: '组织机构名称不能为空' },
      { max: 50, message: '组织机构名称不能大于20个字符', trigger: 'blur' },
    ],
    managerId: [{ required: true, message: '组织机构负责人不能为空' }],
  };
  
  // 更新表单数据
  function updateFormData(data) {
    Object.assign(formState, defaultDepartmentForm);
    if (data) {
      Object.assign(formState, data);
    }
    visible.value = true;
  }

  // 重置表单数据
  function resetFormData() {
    Object.assign(formState, defaultDepartmentForm);
  }

  async function handleOk() {
    try {
      await formRef.value.validate();
      if (formState.id) {
        updateDepartment();
      } else {
        addDepartment();
      }
    } catch (error) {
      message.error('参数验证错误，请仔细填写表单数据!');
    }
  }

  // ----------------------- form 表单  ajax 操作 ---------------------
  //添加组织机构ajax请求
  async function addDepartment() {
    SmartLoading.show();
    try {
      await departmentApi.addDepartment(formState);
      emits('refresh');
      closeModal();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }

  //更新组织机构ajax请求
  async function updateDepartment() {
    SmartLoading.show();
    try {
      if (formState.pid == formState.id) {
        message.warning('上级菜单不能为自己');
        return;
      }
      await departmentApi.updateDepartment(formState);
      emits('refresh');
      closeModal();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }
</script>