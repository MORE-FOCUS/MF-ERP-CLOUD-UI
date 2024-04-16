<!--
  * 租户所属行业
  *
  * @author:    loki
  * @date:      2024-04-09 00:06:08
-->
<template>
    <a-drawer :body-style="{ paddingBottom: '80px' }" :maskClosable="true" :title="form.menuId ? '编辑' : '添加'"
        :open="visible" :width="600" @close="onClose">

        <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }">
            <a-form-item label="名称" name="id">
                <a-input style="width: 100%" v-model:value="form.name" placeholder="名称" />
            </a-form-item>
            <a-form-item label="图标" name="icon">
                <a-input style="width: 100%" v-model:value="form.icon" placeholder="图标" />
            </a-form-item>
            <a-form-item label="排序" name="sortValue">
                <a-input style="width: 100%" v-model:value="form.sortValue" placeholder="排序" />
            </a-form-item>
            <a-form-item label="状态" name="isDisabled">
                <a-select v-model:value="form.isDisabled" placeholder="请选择状态">
                    <a-select-option :value="0">启用</a-select-option>
                    <a-select-option :value="1">禁用</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>

        <template #footer>
            <a-space>
                <a-button @click="onClose">取消</a-button>
                <a-button type="primary" @click="onSubmit">保存</a-button>
            </a-space>
        </template>
    </a-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { tenantIndustryApi } from '/@/api/business/tenant/tenant-industry-api';
import { smartSentry } from '/@/lib/smart-sentry';

// ------------------------ 事件 ------------------------

const emits = defineEmits(['reloadList']);

// ------------------------ 显示与隐藏 ------------------------
// 是否显示
const visible = ref(false);

async function showDrawer(rowData) {
    Object.assign(form, formDefault);
    if (rowData && !_.isEmpty(rowData)) {
        Object.assign(form, rowData);
    }
    visible.value = true;
}

function onClose() {
    Object.assign(form, formDefault);
    formRef.value.resetFields();
    visible.value = false;
}

// ------------------------ 表单 ------------------------

// 组件ref
const formRef = ref();

const formDefault = {
    id: undefined,
    name: undefined, //名称
    icon: undefined, //图标
    sortValue: undefined
};

let form = reactive({ ...formDefault });

const rules = {
    name: [{ required: true, message: '行业名称必填' }],
    icon: [{ required: true, message: '图标必填' }],
};

// 点击确定，验证表单
async function onSubmit() {
    try {
        await formRef.value.validateFields();
        save();
    } catch (err) {
        message.error('参数验证错误，请仔细填写表单数据!');
    }
}

// 新建、编辑API
async function save() {
    SmartLoading.show();
    try {
        if (form.id) {
            await tenantIndustryApi.update(form);
        } else {
            await tenantIndustryApi.add(form);
        }
        message.success('操作成功');
        emits('reloadList');
        onClose();
    } catch (err) {
        smartSentry.captureError(err);
    } finally {
        SmartLoading.hide();
    }
}

defineExpose({
    showDrawer,
});
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
    text-align: right;
    z-index: 1;
  }
  .hint {
    margin-top: 5px;
    color: #bfbfbf;
  }
</style>
