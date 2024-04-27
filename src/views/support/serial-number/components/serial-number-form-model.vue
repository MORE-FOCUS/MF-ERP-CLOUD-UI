<template>
    <a-drawer title="新增或者更新" width="600" :open="visible"
        :body-style="{ paddingBottom: '80px' }" @close="onClose" destroyOnClose>
        <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-form-item label="ID" name="serialNumberId">
                <a-input v-model:value="form.serialNumberId" placeholder="请输入ID" />
            </a-form-item>
            <a-form-item label="业务" name="businessName">
                <a-input v-model:value.trim="form.businessName" placeholder="请输入业务名称" />
            </a-form-item>
            <a-form-item label="编号前缀" name="serialNumberPrefix">
                <a-input v-model:value.trim="form.serialNumberPrefix" placeholder="请输入编码前缀" />
            </a-form-item>
            <a-form-item label="循环周期" name="ruleType">
                <SmartEnumSelect enum-name="RULE_TYPE_ENUM" v-model:value="form.ruleType" @change="ruleTypeChange"
                    width="160px" />
            </a-form-item>
            <a-form-item label="格式" name="format">
                <a-input v-model:value.trim="form.format" />
            </a-form-item>
            <a-form-item label="初始值" name="initNumber">
                <a-input-number style="width:50%" v-model:value="form.initNumber" />
            </a-form-item>
            <a-form-item label="随机增量" name="stepRandomRange">
                <a-input-number style="width:50%" v-model:value="form.stepRandomRange" />
            </a-form-item>
            <a-form-item label="备注" name="remark">
                <a-textarea style="width: 100%" :rows="3" v-model:value.trim="form.remark" showCount :maxlength="64" />
            </a-form-item>
        </a-form>

        <div class="footer">
            <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
            <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
            <a-button v-if="!form.serialNumberId" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
        </div>
    </a-drawer>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { serialNumberApi } from '/@/api/support/serial-number-api';
import { smartSentry } from '/@/lib/smart-sentry';
import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
import { RULE_TYPE_ENUM } from '/@/constants/support/serial-number-const';
// ----------------------- 以下是字段定义 emits props ---------------------
const emits = defineEmits(['refresh']);

// ----------------------- 显示/隐藏 ---------------------

const visible = ref(false); // 是否展示抽屉

// 隐藏
function onClose() {
    reset();
    visible.value = false;
}

// 显示
async function showDrawer(data) {
    Object.assign(form, formDefault);
    if (data && !_.isEmpty(data)) {
        Object.assign(form, data);
    }
    visible.value = true;
}

// ----------------------- 表单显示 ---------------------

const formRef = ref();
const formDefault = {
    serialNumberId: undefined,
    businessName: undefined,
    serialNumberPrefix: '',
    format: '',
    ruleType: undefined,
    initNumber: 0,
    stepRandomRange: 1
};

let form = reactive(_.cloneDeep(formDefault));

function reset() {
    Object.assign(form, formDefault);
    formRef.value.resetFields();
}


// ----------------------- 表单提交 ---------------------
// 表单规则
const rules = {
    name: [
        { required: true, message: '供应商全称不能为空' },
        { max: 30, message: '供应商全称不能大于30个字符', trigger: 'blur' },
    ],
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
        await serialNumberApi.update(form);
        message.success('操作成功');
        emits('refresh');
        onClose();
    } catch (err) {
        smartSentry.captureError(err);
    } finally {
        SmartLoading.hide();
    }
}

//拼接编码格式
function ruleTypeChange() {
    buildFormat(form.serialNumberPrefix);
}

watch(
    () => form.serialNumberPrefix,
    (newValue) => {
        buildFormat(newValue);
    }
);

function buildFormat(prefix) {
    let format = prefix;
    if (RULE_TYPE_ENUM.YEAR.value === form.ruleType) {
        format = format + '[yyyy][nnnnn]';
    } else if (RULE_TYPE_ENUM.MONTH.value === form.ruleType) {
        format = format + '[yyyy][mm][nnnnn]';
    } else if (RULE_TYPE_ENUM.DAY.value === form.ruleType) {
        format = format + '[yyyy][mm][dddd][nnnnn]';
    } else {
        format = format + '[nnnnn]'
    }
    form.format = format;
}

// ----------------------- 以下是暴露的方法内容 ----------------------------
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
    text-align: left;
    z-index: 1;
}

.hint {
    margin-top: 5px;
    color: #bfbfbf;
}
</style>