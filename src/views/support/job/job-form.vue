<!--
  * 定时任务调度表
  *
  * @author:    loki
  * @date:      2024-01-21 16:37:55
-->
<template>
    <a-drawer :title="form.jobId ? '编辑' : '添加'" :width="600" :visible="visibleFlag" @cancel="onClose" :maskClosable="false"
        :destroyOnClose="true">
        <a-form ref="formRef" :model="form" :rules="rules" :label-col="{ span: 5 }">

            <a-form-item label="任务组" name="jobGroup">
                <smart-enum-select style="width: 100%" v-model:value="form.jobGroup" placeholder="任务组"
                    enum-name="JOB_GROUP_ENUM" />
            </a-form-item>

            <a-form-item label="任务名称" name="jobName">
                <a-input style="width: 100%" v-model:value="form.jobName" placeholder="任务名称" />
            </a-form-item>

            <a-form-item label="调用方法" name="invokeTarget">
                <a-textarea style="width: 100%" v-model:value="form.invokeTarget" placeholder="调用方法" />
            </a-form-item>

            <a-form-item label="cron执行表达式" name="cronExpression">
                <a-input style="width: 100%" v-model:value="form.cronExpression" placeholder="cron执行表达式" />
            </a-form-item>

            <a-form-item label="状态" name="status">
                <a-radio-group v-model:value="form.status">
                    <a-radio :value="true">正常</a-radio>
                    <a-radio :value="false">暂停</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="是否并发执行" name="concurrent">
                <a-radio-group v-model:value="form.concurrent">
                    <a-radio :value="true">允许</a-radio>
                    <a-radio :value="false">禁止</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="执行错误策略" name="misfirePolicy">
                <smart-enum-select style="width: 100%" v-model:value="form.misfirePolicy" placeholder="执行错误策略"
                    enum-name="MISFIRE_POLICY_ENUM" />
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
import { reactive, ref, nextTick } from 'vue';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { jobApi } from '/@/api/support/job-api';
import { smartSentry } from '/@/lib/smart-sentry';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import {JOB_GROUP_ENUM,MISFIRE_POLICY_ENUM } from '/@/constants/support/job-const.js';

// ------------------------ 事件 ------------------------

const emits = defineEmits(['reloadList']);

// ------------------------ 显示与隐藏 ------------------------
// 是否显示
const visibleFlag = ref(false);

function show(rowData) {
    Object.assign(form, formDefault);
    if (rowData && !_.isEmpty(rowData)) {
        Object.assign(form, rowData);
    }
    visibleFlag.value = true;
    nextTick(() => {
        formRef.value.clearValidate();
    });
}

function onClose() {
    Object.assign(form, formDefault);
    visibleFlag.value = false;
}

// ------------------------ 表单 ------------------------

// 组件ref
const formRef = ref();

const formDefault = {
    jobId: undefined,
    jobName: undefined, //任务名称
    jobGroup: undefined, //任务组名
    invokeTarget: undefined, //调用目标字符串
    status: true,
    misfirePolicy: MISFIRE_POLICY_ENUM.IMMEDIATELY.value,
    concurrent: true,
};

let form = reactive({ ...formDefault });

const rules = {
    jobName: [{ required: true, message: '任务名称 必填' }],
    jobGroup: [{ required: true, message: '任务组名 必填' }],
    invokeTarget: [{ required: true, message: '调用目标字符串 必填' }],
    status: [{ required: true, message: '状态 必填' }],
    concurrent: [{ required: true, message: '是否并发执行 必填' }],
    misfirePolicy: [{ required: true, message: '执行错误策略 必填' }],
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
        if (form.jobId) {
            await jobApi.update(form);
        } else {
            await jobApi.add(form);
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
    show,
});
</script>
