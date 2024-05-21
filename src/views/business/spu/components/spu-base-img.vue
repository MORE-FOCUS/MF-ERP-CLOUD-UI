<template>
  <div class="card-container">
    <a-card size="small" id="baseImg">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品图片</span>
        </div>
      </template>
      <template #extra>
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
  import { ref } from 'vue';
  const rules = ref([]);
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
