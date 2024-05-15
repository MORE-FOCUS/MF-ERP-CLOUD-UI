<template>
    <a-card title="| 期初库存" headStyle="color: #f90; font-size:15px;" id="stock">
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
        </a-form-item> <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
        <a-form-item label="编码" name="code">
          <a-input placeholder="请输入编码"></a-input>
        </a-form-item>
      </a-form>
    </a-card>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    const rules = ref([]);
  </script>
  