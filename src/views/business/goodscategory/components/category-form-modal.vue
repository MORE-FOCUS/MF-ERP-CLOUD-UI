<!--
  * 目录表单
-->
<template>
  <a-drawer :title="form.categoryId ? '编辑' : '添加'" :width="600" :open="visible" :body-style="{ paddingBottom: '80px' }"
    @close="closeModal" destroyOnClose>
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }">
      <a-form-item label="上级类目" name="pid">
        <CategoryTreeSelect v-model:value="form.pid" placeholder="请选择上级类目" :categoryType="form.categoryType"
          :currentSelectedCategoryId="form.pid" />
      </a-form-item>
      <a-form-item label="编码" name="categoryCode">
        <a-input v-model:value.trim="form.categoryCode" placeholder="请输入类目编码" />
      </a-form-item>
      <a-form-item label="名称" name="categoryName">
        <a-input v-model:value.trim="form.categoryName" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="禁用" name="isDisabled">
        <a-switch v-model:checked="form.isDisabled" />
      </a-form-item>
      <a-form-item label="默认" name="isDefault">
        <a-switch v-model:checked="form.isDefault" />
      </a-form-item>
      <a-form-item label="排序" name="sortValue">
        <a-input-number style="width: 40%" v-model:value="form.sortValue" :min="0" placeholder="请输入正整数" />
      </a-form-item>
    </a-form>
    <div class="footer">
      <a-button style="margin-right: 8px" @click="closeModal">取消</a-button>
      <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
      <a-button v-if="!form.categoryId" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
    </div>
  </a-drawer>
</template>
<script setup>
import message from 'ant-design-vue/lib/message';
import { reactive, ref } from 'vue';
import { categoryApi } from '/@/api/business/category/category-api';
import { serialNumberApi } from '/@/api/support/serial-number-api';
import CategoryTreeSelect from '/@/components/business/category-tree-select/index.vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { smartSentry } from '/@/lib/smart-sentry';
import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';

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
const defaultCategoryForm = {
  categoryId: undefined,
  categoryName: undefined,
  categoryCode: undefined,
  isDisabled: false,
  isDefault: false,
  pid: undefined,
  sortValue: undefined,
};

let form = reactive({
  ...defaultCategoryForm,
});

// 表单校验规则
const rules = {
  categoryCode: [
    { required: true, message: '编码不能为空' },
    { max: 20, message: '编码不能大于20个字符', trigger: 'blur' },
  ],
  categoryName: [
    { required: true, message: '名称不能为空' },
    { max: 20, message: '名称不能大于20个字符', trigger: 'blur' },
  ],
};

// 更新表单数据
async function updateFormData(data) {
  Object.assign(form, defaultCategoryForm);
  if (data) {
    Object.assign(form, data);
  }

  if (!form.categoryId) {
    //新增,生成编码
    let res = await serialNumberApi.generate({ "serialNumberId": SERIAL_NUMBER_ID_ENUM.SPBM.value });
    form.categoryCode = res.data;
  }

  visible.value = true;
}

// 重置表单数据
function resetFormData() {
  Object.assign(form, defaultCategoryForm);
}

// ----------------------- form 表单  ajax 操作 ---------------------
// 点击确定，验证表单
async function onSubmit() {
  try {
    await formRef.value.validateFields();
    if (form.id) {
      updateCategory(form);
    } else {
      addCategory(form);
    }
  } catch (err) {
    message.error('参数验证错误，请仔细填写表单数据!');
  }
}
//添加目录ajax请求
async function addCategory(keepAdding) {
  SmartLoading.show();
  try {
    await categoryApi.add(form);
    emits('reloadList');

    if (keepAdding) {
      updateFormData(form);
    }
    else {
      closeModal();
    }
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
    if (form.pid === form.categoryId) {
      message.warning('上级类目不能为自己');
      return;
    }
    await categoryApi.update(form);
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
