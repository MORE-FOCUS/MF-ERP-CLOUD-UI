<template>
  <div class="card-container">
    <a-card size="small" id="base">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">基本信息</span>
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
      <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }">
        <a-form-item label="商品编码" name="spuNo">
          <a-input v-model:value="form.spuNo" placeholder="请输入编码" />
        </a-form-item>
        <a-form-item label="商品全称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item label="商品别名" name="alias">
          <a-input v-model:value="form.alias" placeholder="请输入别名" />
        </a-form-item>
        <a-form-item label="商品分类" name="categoryId">
          <CategoryTreeSelect v-model:value="form.categoryId" placeholder="请选择分类" :categoryType="CATEGORY_TYPE_ENUM.SPU.value" width="50%" />
        </a-form-item>
        <a-form-item label="计量单位" name="unitId">
          <UnitSelect v-model:value="form.unitId" width="50%" />
        </a-form-item>
        <a-form-item label="商品品牌" name="brand">
          <BrandSelect v-model:value="form.brandId" width="50%" />
        </a-form-item>
        <a-form-item label="商品规格" name="specs">
          <a-input v-model:value="form.specs" placeholder="请输入规格" />
        </a-form-item>
        <a-form-item label="商品产地" name="place">
          <a-input v-model:value="form.place" placeholder="请输入产地" />
        </a-form-item>
        <a-form-item label="启用" name="isDisabled">
          <a-switch v-model:checked="form.isDisabled" />
        </a-form-item>
        <a-form-item label="上架" name="isListed">
          <a-switch v-model:checked="form.isListed" />
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import CategoryTreeSelect from '/@/components/business/category-tree-select/index.vue';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import BrandSelect from '/@/components/business/brand-select/index.vue';
  import UnitSelect from '/@/components/business/unit-select/index.vue';
  import { serialNumberApi } from '/@/api/support/serial-number-api';
  import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';
  import { spuApi } from '/@/api/business/spu/spu-api';

  const emit = defineEmits(['reloadDetail']);

  const rules = {
    spuNo: [{ required: true, message: '商品编码不能为空' }],
    name: [{ required: true, message: '商品名称不能为空' }],
    categoryId: [{ required: true, message: '商品类别不能为空' }],
    unitId: [{ required: true, message: '商品单位不能为空' }],
  };

  const formRef = ref();

  const formDefault = {
    id: undefined,
    spuNo: undefined,
    name: undefined,
    alias: undefined,
    categoryId: undefined,
    unitId: undefined,
    brandId: undefined,
    place: undefined,
    specs: undefined,
    isDisabled: false,
    isListed: true,
    status: 1,
  };

  let form = reactive(_.cloneDeep(formDefault));
  function updateData(rawData) {
    debugger;
    Object.assign(form, formDefault);
    if (rawData) {
      Object.assign(form, rawData);
    } else {
      genSpuNo();
    }
  }

  async function genSpuNo() {
    if (!form.id) {
      let res = await serialNumberApi.generate({ serialNumberId: SERIAL_NUMBER_ID_ENUM.SPBM.value });
      form.spuNo = res.data;
    }
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.id) {
        await spuApi.updateSpuBase(form);
      } else {
        const res = await spuApi.addSpuBase(form);
        form.id = res.data;
      }

      //通知父节点,刷新商品详情,通知其他兄弟组件
      emit('reloadDetail', form.id);
      message.success('基本信息保存成功');
    } catch (err) {
      smartSentry.captureError(err);
    } finally {
      SmartLoading.hide();
    }
  }

  defineExpose({
    updateData,
  });
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
