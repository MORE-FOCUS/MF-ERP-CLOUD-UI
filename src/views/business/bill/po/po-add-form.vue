<!--
  * 新增购货订单
  *
  * @author:    loki
  * @date:      2024-07-04 23:20:21
-->
<template>
  <a-card size="small" :bordered="false">
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-row :gutter="24" style="margin-bottom: 5px">
        <a-col :span="24">
          <a-space>
            <a-button @click="onSubmit(true)" size="middle">历史单据</a-button>
            <a-button @click="onSubmit(false)" size="middle">保存并审核</a-button>
            <a-button @click="onSubmit(true)" size="middle">保存</a-button>
            <a-button @click="onClose" size="middle">取消</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider />
      <a-row>
        <a-col :span="6">
          <a-form-item label="单据编号" name="supplier">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="供应商" name="supplier">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="业务员" name="salesman">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="部门" name="salesman">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-form-item label="单据日期" name="salesman">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label="交货日期" name="salesman">
            <a-input style="width: 100%" v-model:value.trim="form.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider />
      <a-table size="small" :dataSource="tableData" :columns="columns" rowKey="id" bordered :loading="tableLoading">
        <template #bodyCell="{ record, index, column }">
          <template v-if="column.dataIndex === 'no'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div class="smart-table-operate">
              <a-button @click="showForm(record)" type="link">编辑</a-button>
              <a-button @click="showForm(record)" type="link">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-form>
  </a-card>
</template>
<script setup>
  import { nextTick, reactive, ref } from 'vue';
  import _ from 'lodash';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';

  import { billApi } from '/@/api/business/bill/bill-api';
  import { smartSentry } from '/@/lib/smart-sentry';

  // ------------------------ 事件 ------------------------

  const emits = defineEmits(['reloadList']);

  // ------------------------ 显示与隐藏 ------------------------
  // 是否显示
  const visible = ref(false);

  function show(rowData) {
    Object.assign(form, formDefault);
    if (rowData && !_.isEmpty(rowData)) {
      Object.assign(form, rowData);
    }
    visible.value = true;
    nextTick(() => {
      formRef.value.clearValidate();
    });
  }

  function onClose() {
    Object.assign(form, formDefault);
    visible.value = false;
  }

  // ------------------------ 表单 ------------------------

  // 组件ref
  const formRef = ref();

  const formDefault = {
    id: undefined,
    id: undefined, //分类id
    updateTime: undefined, //更新时间
    isDeleted: undefined, //是否删除 1-删除 0-未删除
    createTime: undefined, //创建时间
  };

  let form = reactive({ ...formDefault });

  const rules = {
    id: [{ required: true, message: '分类id 必填' }],
    updateTime: [{ required: true, message: '更新时间 必填' }],
    isDeleted: [{ required: true, message: '是否删除 1-删除 0-未删除 必填' }],
    createTime: [{ required: true, message: '创建时间 必填' }],
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
        await billApi.update(form);
      } else {
        await billApi.add(form);
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
