<!--
  * 组织机构表单
-->
<template>
  <a-drawer
    :title="form.id ? '编辑' : '添加'"
    :width="600"
    :open="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="closeModal"
    destroyOnClose
  >
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="部门类型" name="type">
        <DictSelect key-code="DEPARTMENT_TYPE" v-model:value="form.type" width="100px" placeholder="请选择部门类型" />
      </a-form-item>
      <a-form-item label="上级部门" name="pid" v-if="form.pid != 0">
        <DepartmentTreeSelect ref="departmentTreeSelect" v-model:value="form.pid" :defaultValueFlag="false" width="100%" />
      </a-form-item>
      <a-form-item label="部门名称" name="name">
        <a-input v-model:value.trim="form.name" placeholder="请输入部门名称" />
      </a-form-item>
      <a-form-item label="部门编码" name="name">
        <a-input v-model:value.trim="form.code" placeholder="请输入部门编码" />
      </a-form-item>
      <a-form-item label="部门负责人" name="managerId">
        <EmployeeSelect ref="employeeSelect" placeholder="请选择部门负责人" width="100%" v-model:value="form.managerId" :leaveFlag="false" />
      </a-form-item>
      <a-form-item label="部门排序" name="sortValue">
        <a-input-number style="width: 100%" v-model:value="form.sortValue" :min="0" placeholder="请输入正整数" />
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="closeModal">取消</a-button>
      <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
      <a-button v-if="!form.id" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
  import message from 'ant-design-vue/lib/message';
  import { reactive, ref } from 'vue';
  import { serialNumberApi } from '/@/api/support/serial-number-api';
  import { departmentApi } from '/@/api/system/department-api';
  import DepartmentTreeSelect from '/@/components/system/department-tree-select/index.vue';
  import EmployeeSelect from '/@/components/system/employee-select/index.vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';
  import DictSelect from '/@/components/support/dict-select/index.vue';

  // ----------------------- 对外暴漏 ---------------------

  defineExpose({
    showDrawer,
  });

  // ----------------------- modal 的显示与隐藏 ---------------------
  const emits = defineEmits(['reloadList']);

  const visible = ref(false);

  function showDrawer(data) {
    visible.value = true;
    updateFormData(data);
  }

  function closeModal() {
    visible.value = false;
    resetFormData();
  }

  // ----------------------- form 表单操作 ---------------------
  const formRef = ref();
  const defaultForm = {
    id: undefined,
    code: undefined,
    name: undefined,
    isDisabled: false,
    isDefault: false,
    managerId: undefined,
    pid: undefined,
    sortValue: undefined,
    type: "2",
  };

  let form = reactive({
    ...defaultForm,
  });

  // 表单校验规则
  const rules = {
    code: [
      { required: true, message: '编码不能为空' },
      { max: 20, message: '编码不能大于10个字符', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '名称不能为空' },
      { max: 20, message: '名称不能大于50个字符', trigger: 'blur' },
    ],
  };

  // 更新表单数据
  async function updateFormData(data) {
    Object.assign(form, defaultForm);
    if (data) {
      Object.assign(form, data);
    }

    if (!form.id) {
      //新增,生成编码
      let res = await serialNumberApi.generate({ serialNumberId: SERIAL_NUMBER_ID_ENUM.DEPT.value });
      form.code = res.data;
    }

    visible.value = true;
  }

  // 重置表单数据
  function resetFormData() {
    Object.assign(form, defaultForm);
  }

  // ----------------------- form 表单  ajax 操作 ---------------------
  // 点击确定，验证表单
  async function onSubmit() {
    try {
      await formRef.value.validateFields();
      if (form.id) {
        update(form);
      } else {
        add(form);
      }
    } catch (err) {
      message.error('参数验证错误，请仔细填写表单数据!');
    }
  }
  //添加目录ajax请求
  async function add(keepAdding) {
    SmartLoading.show();
    try {
      await departmentApi.addDepartment(form);
      emits('reloadList');

      if (keepAdding) {
        updateFormData(form);
      } else {
        closeModal();
      }
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }

  //更新目录ajax请求
  async function update() {
    SmartLoading.show();
    try {
      if (form.pid === form.id) {
        message.warning('上级部门不能为自己');
        return;
      }
      await departmentApi.updateDepartment(form);
      emits('reloadList');
      closeModal();
    } catch (error) {
      smartSentry.captureError(error);
    } finally {
      SmartLoading.hide();
    }
  }
</script>
<style scoped lang="less">
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: left;
    z-index: 1;
  }

  .hint {
    margin-top: 5px;
    color: #bfbfbf;
  }
</style>
