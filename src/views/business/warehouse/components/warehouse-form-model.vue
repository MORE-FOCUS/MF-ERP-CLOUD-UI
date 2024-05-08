<!--
  *  员工 表单 弹窗
-->
<template>
    <a-drawer :title="form.id ? '编辑' : '添加'" :width="600" :open="visible" :body-style="{ paddingBottom: '80px' }"
        @close="onClose" destroyOnClose>
        <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }">
            <a-form-item label="编码" name="code">
                <a-input v-model:value.trim="form.code" placeholder="请输入仓库编码" />
            </a-form-item>
            <a-form-item label="名称" name="name">
                <div style="display: inline-block; width: 70%;"><a-input v-model:value.trim="form.name"
                        placeholder="请输入名称" /></div>
                <div style="display: inline-block; margin-left: 10px;">
                    <a-checkbox v-model:value="form.isDefault">默认仓库</a-checkbox>
                </div>
            </a-form-item>

            <a-form-item label="仓库分类" name="categoryId">
                <CategoryTreeSelect v-model:value="form.categoryId" placeholder="请选择类别"
                    :categoryType="form.categoryType" :currentSelectedCategoryId="form.categoryId" />
            </a-form-item>
            <a-form-item label="联系人" name="contact">
                <a-input v-model:value.trim="form.contact" placeholder="请输入联系人" />
            </a-form-item>
            <a-form-item label="联系电话" name="tel">
                <a-input v-model:value.trim="form.tel" placeholder="请输入联系电话" />
            </a-form-item>
            <a-form-item label="备注" name="remark">
                <a-textarea style="width: 100%" :rows="3" v-model:value.trim="form.remark" showCount :maxlength="128" />
            </a-form-item>
        </a-form>
        <div class="footer">
            <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
            <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
            <a-button v-if="!form.supplierId" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
        </div>
    </a-drawer>
</template>
<script setup>
import { reactive, ref } from 'vue';
import _ from 'lodash';
import { message } from 'ant-design-vue';
import { SmartLoading } from '/@/components/framework/smart-loading';
import { warehouseApi } from '/@/api/business/warehouse/warehouse-api';
import { smartSentry } from '/@/lib/smart-sentry';
import CategoryTreeSelect from '/@/components/business/category-tree-select/index.vue'
import { serialNumberApi } from '/@/api/support/serial-number-api';
import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';
// ----------------------- 以下是字段定义 emits props ---------------------
// emit
const emits = defineEmits(['reloadList']);

// ----------------------- 显示/隐藏 ---------------------

const visible = ref(false); // 是否展示抽屉

// 隐藏
function onClose() {
    reset();
    visible.value = false;
}

// 显示
async function showDrawer(data) {
    updateFormData(data);
    visible.value = true;
}

// 更新表单数据
async function updateFormData(data) {
  Object.assign(form, formDefault);
  if (data) {
    Object.assign(form, data);
  }

  if (!form.id) {
    //新增,生成编码
    let res = await serialNumberApi.generate({ "serialNumberId": SERIAL_NUMBER_ID_ENUM.CK.value });
    form.code = res.data;
  }
}

// ----------------------- 表单显示 ---------------------

const formRef = ref();
const formDefault = {
    categoryId: undefined,
    code: undefined,
    name: undefined,
    isDefault: false,
    isDisabled: false,
    contact: undefined,
    tel: undefined,
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
        { required: true, message: '仓库名称不能为空' },
        { max: 30, message: '仓库名称不能大于30个字符', trigger: 'blur' },
    ],
};
// 点击确定，验证表单
async function onSubmit(keepAdding) {
    try {
        await formRef.value.validateFields();
        save(keepAdding);
    } catch (err) {
        message.error('参数验证错误，请仔细填写表单数据!');
    }
}

// 新建、编辑API
async function save(keepAdding) {
    SmartLoading.show();
    try {
        if (form.id) {
            await warehouseApi.update(form);
        } else {
            await warehouseApi.add(form);
        }
        message.success('操作成功');
        emits('reloadList');
        if (keepAdding) {
            updateFormData(form);
        }
        else {
            onClose();
        }
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
    text-align: left;
    z-index: 1;
}

.hint {
    margin-top: 5px;
    color: #bfbfbf;
}
</style>