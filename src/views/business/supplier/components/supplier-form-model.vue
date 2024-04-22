<!--
  *  员工 表单 弹窗
-->
<template>
    <a-drawer :title="form.id ? '编辑' : '添加'" :width="600" :open="visible" :body-style="{ paddingBottom: '80px' }"
        @close="onClose" destroyOnClose>
        <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-form-item label="编码" name="code">
                <a-input v-model:value.trim="form.code" placeholder="请输入供应商编码" />
            </a-form-item>
            <a-form-item label="简称" name="name">
                <div style="display: inline-block; width: 70%;"><a-input v-model:value.trim="form.name"
                        placeholder="请输入供应商简称" /></div>
                <div style="display: inline-block; margin-left: 10px;">
                    <a-checkbox v-model:value="form.isDefault" @click.prevent>默认供应商</a-checkbox>
                </div>
            </a-form-item>
            <a-form-item label="全称" name="fullName">
                <a-input v-model:value.trim="form.fullName" placeholder="请输入供应商全称" />
            </a-form-item>
            <a-form-item label="供应商分类" name="categoryId">
                <CategoryTreeSelect v-model:value="form.categoryId" placeholder="请选择类别"
                    :categoryType="form.categoryType" :currentSelectedCategoryId="form.categoryId" />
            </a-form-item>
            <a-form-item label="单位电话" name="workTelephone">
                <a-input v-model:value.trim="form.workTelephone" placeholder="请输入单位电话" />
            </a-form-item>
            <a-form-item label="联系人" name="contacts">
                <a-input v-model:value.trim="form.contacts" placeholder="请输入联系人" />
            </a-form-item>
            <a-form-item label="联系电话" name="phone">
                <a-input v-model:value.trim="form.phone" placeholder="请输入联系电话" />
            </a-form-item>
            <a-form-item label="联系地址" name="address">
                <a-textarea style="width: 100%" :rows="3" v-model:value.trim="form.address" placeholder="请输入联系地址"
                    showCount :maxlength="64" />
            </a-form-item>
            <a-form-item label="期初欠款" name="originDebt">
                <a-input v-model:value.trim="form.originDebt" prefix="￥" suffix="RMB" />
            </a-form-item>
            <a-divider orientation="left">
                <a-button type="link" @click="changeMore">更多</a-button>
            </a-divider>
            <div v-if="moreRef">
                <a-form-item label="邮箱" name="email">
                    <a-input v-model:value.trim="form.email" />
                </a-form-item>
                <a-form-item label="微信" name="wechat">
                    <a-input v-model:value.trim="form.wechat" />
                </a-form-item>
                <a-form-item label="邮编" name="postal">
                    <a-input v-model:value.trim="form.postal" />
                </a-form-item>
                <a-form-item label="QQ" name="qq">
                    <a-input v-model:value.trim="form.qq" />
                </a-form-item>
                <a-form-item label="传真" name="tax">
                    <a-input v-model:value.trim="form.tax" />
                </a-form-item>
            </div>
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

const moreRef = ref(false);

function changeMore() {
    moreRef.value = !moreRef.value;
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