<template>
  <a-card title="| 基本信息" headStyle="color: #f90; font-size:15px;" id="base" style="margin-right: 15px">
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
      <a-form-item label="商品编码" name="code">
        <a-input placeholder="请输入编码"></a-input>
      </a-form-item>
      <a-form-item label="商品全称" name="name">
        <a-input placeholder="请输入名称"></a-input>
      </a-form-item>
      <a-form-item label="商品别名" name="name">
        <a-input placeholder="请输入别名"></a-input>
      </a-form-item>
      <a-form-item label="商品分类" name="categoryId">
        <CategoryTreeSelect v-model:value="form.categoryId" placeholder="请选择分类" :categoryType="CATEGORY_TYPE_ENUM.SPU.value" width="50%" />
      </a-form-item>
      <a-form-item label="商品品牌" name="brand">
        <a-input placeholder="请选择品牌"></a-input>
      </a-form-item>
      <a-form-item label="商品规格" name="specs">
        <a-input placeholder="请输入规格"></a-input>
      </a-form-item>
      <a-form-item label="商品产地" name="place">
        <a-input placeholder="请输入产地"></a-input>
      </a-form-item>
      <a-form-item label="启用" name="idDisabled">
        <a-switch v-model:checked="form.idDisabled" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import CategoryTreeSelect from '/@/components/business/category-tree-select/index.vue';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
  import { message } from 'ant-design-vue';
  const rules = {
    code: [{ required: true, message: '商品编码不能为空' }],
    name: [{ required: true, message: '商品编码不能为空' }],
    categoryId: [{ required: true, message: '类别不能为空' }],
  };

  const formRef = ref();
  const formDefault = {
    categoryId: undefined,
    name: undefined,
    code: undefined,
    idDisabled: false,
    enableMultiUnit: false,
  };

  let form = reactive(_.cloneDeep(formDefault));
</script>
