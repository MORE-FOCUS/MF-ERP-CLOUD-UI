<template>
  <div class="card-container">
    <a-card size="small" id="stockWarn">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">库存预警</span>
        </div>
      </template>
      <template #extra v-if="form.spuId">
        <a-button type="link" @click="extraClick">
          <template #icon>
            <SaveOutlined />
          </template>
          保存</a-button
        >
      </template>

      <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { message } from 'ant-design-vue';
  import { spuApi } from '/src/api/business/spu/spu-api';
  const rules = ref([]);
  const formRef = ref();
  const formDefault = {
    spuId: undefined,
  };

  let form = reactive(_.cloneDeep(formDefault));
  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      form.spuId = rawData.id;
    }
  }

  defineExpose({
    updateData,
  })
</script>

<style lang="less" scoped>
  .card-container {
    background-color: #fff;
    height: 100%;
    margin-right: 15px;
    margin-top: 15px;

    .title {
      display: flex;
      align-items: center;
      &::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 0;
        width: 3px;
        height: 30px;
        background-color: @primary-color;
      }
    }
  }
</style>
