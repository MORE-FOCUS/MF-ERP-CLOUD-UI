<template>
  <a-card title="| 商品单位" headStyle="color: #f90; font-size:15px;" id="baseImg" style="margin-top: 10px; margin-right: 15px">
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="基础单位" name="unitId">
        <UnitSelect v-model:value="form.unitId" width="50%" />
      </a-form-item>
      <a-form-item label="多单位" name="enableMultiUnit">
        <a-switch v-model:checked="form.enableMultiUnit" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import UnitSelect from '/@/components/business/unit-select/index.vue';
  import { message } from 'ant-design-vue';

  const rules = {
    unitId: [{ required: true, message: '基础单位不能为空' }],
  };

  const formRef = ref();
  const formDefault = {
    unitId: undefined,
  };

  let form = reactive(_.cloneDeep(formDefault));
</script>
