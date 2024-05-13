<!--
  * 商品表单
-->
<template>
  <a-drawer :title="form.spuId ? '编辑' : '添加'" width="60%" :open="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
    
  </a-drawer>
</template>
<script setup>
  import { ref, nextTick, reactive } from 'vue';
  import CategoryTree from '/@/components/business/category-tree-select/index.vue';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { SPU_STATUS_ENUM } from '/@/constants/business/spu/spu-const';
  import _ from 'lodash';
  import { spuApi } from '/@/api/business/spu/spu-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
  import DictSelect from '/@/components/support/dict-select/index.vue';

  // emit
  const emit = defineEmits(['reloadList']);

  // 组件ref
  const formRef = ref();

  const formDefault = {
    //商品分类
    categoryId: undefined,
    //商品名称
    name: undefined,
    //商品状态
    status: SPU_STATUS_ENUM.APPOINTMENT.value,
    //产地
    place: undefined,
    //商品价格
    price: undefined,
    //上架状态
    shelvesFlag: true,
    //备注
    remark: '',
    //商品id
    id: undefined,
  };
  let form = reactive({ ...formDefault });
  const rules = {
    categoryId: [{ required: true, message: '请选择商品分类' }],
    spuName: [{ required: true, message: '商品名称不能为空' }],
    spuStatus: [{ required: true, message: '商品状态不能为空' }],
    price: [{ required: true, message: '商品价格不能为空' }],
    place: [{ required: true, message: '产地不能为空' }],
  };
  // 是否展示抽屉
  const visible = ref(false);

  function showDrawer(rowData) {
    Object.assign(form, formDefault);
    if (rowData && !_.isEmpty(rowData)) {
      Object.assign(form, rowData);
    }
    if (form.place && form.place.length > 0) {
      form.place = form.place[0].valueCode;
    }
    console.log(form);
    visible.value = true;
    nextTick(() => {
      formRef.value.clearValidate();
    });
  }

  function onClose() {
    Object.assign(form, formDefault);
    visible.value = false;
  }

  function onSubmit() {
    formRef.value
      .validate()
      .then(async () => {
        SmartLoading.show();
        try {
          let params = _.cloneDeep(form);
          if (params.place && Array.isArray(params.place) && params.place.length > 0) {
            params.place = params.place[0].valueCode;
          }
          if (form.spuId) {
            await spuApi.updateSpu(params);
          } else {
            await spuApi.addSpu(params);
          }
          message.success(`${form.spuId ? '修改' : '添加'}成功`);
          onClose();
          emit('reloadList');
        } catch (error) {
          smartSentry.captureError(error);
        } finally {
          SmartLoading.hide();
        }
      })
      .catch((error) => {
        console.log('error', error);
        message.error('参数验证错误，请仔细填写表单数据!');
      });
  }

  defineExpose({
    showDrawer,
  });
</script>
