<!--
  *  员工 表单 弹窗
-->
<template>
    <a-drawer :title="form.categoryId ? '编辑' : '添加'" :width="800" :open="visible"
        :body-style="{ paddingBottom: '80px' }" @close="onClose" destroyOnClose>
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
            <a-form-item label="分类" name="categoryId">
                <CategoryTreeSelect v-model:value="form.categoryId" placeholder="请选择类别"
                    :categoryType="form.categoryType" :currentSelectedCategoryId="form.categoryId" />
            </a-form-item>
            <a-form-item label="名称" name="name">
                <a-input v-model:value.trim="form.name" placeholder="请输入名称" />
            </a-form-item>
            <a-form-item label="联系人" name="contacts">
                <a-input v-model:value.trim="form.contacts" placeholder="请输入联系人" />
            </a-form-item>
            <a-form-item label="微信" name="wechat">
                <a-input v-model:value.trim="form.wechat" placeholder="请输入微信" />
            </a-form-item>
            <a-form-item label="传真" name="tax">
                <a-input v-model:value.trim="form.tax" placeholder="请输入传真" />
            </a-form-item>
            <a-form-item label="初始欠款" name="originDebt">
                <a-input v-model:value.trim="form.originDebt" placeholder="请输入初始欠款" />
            </a-form-item>
            <a-form-item label="欠款" name="debt">
                <a-input v-model:value.trim="form.debt" placeholder="请输入欠款" />
            </a-form-item>
            <a-form-item label="状态" name="isDisabled">
                <a-select v-model:value="form.isDisabled" placeholder="请选择状态">
                    <a-select-option :value="0">启用</a-select-option>
                    <a-select-option :value="1">禁用</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="默认" name="isDisabled">
                <a-select v-model:value="form.isDisabled" placeholder="请选择状态">
                    <a-select-option :value="1">是</a-select-option>
                    <a-select-option :value="0">否</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
        <div class="footer">
            <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
            <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
            <a-button v-if="!form.employeeId" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
        </div>
    </a-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { supplierApi } from '/@/api/business/supplier/supplier-api';
import { smartSentry } from '/@/lib/smart-sentry';
import CategoryTreeSelect from '/@/components/business/category-tree-select/index.vue'
// ----------------------- 以下是字段定义 emits props ---------------------
// emit
const emit = defineEmits(['reloadList']);

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
    categoryId: undefined,
    name: undefined,
    isDefault: false,
    contacts: undefined,
    wechat: undefined,
    tax: undefined,
    originDebt: 0,
    debt: 0
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
        { required: true, message: '登录账号不能为空' },
        { max: 30, message: '登录账号不能大于30个字符', trigger: 'blur' },
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
        if (form.id) {
            await supplierApi.update(form);
        } else {
            await supplierApi.add(form);
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
    text-align: right;
    z-index: 1;
}

.hint {
    margin-top: 5px;
    color: #bfbfbf;
}
</style>