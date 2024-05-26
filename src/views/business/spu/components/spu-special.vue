<template>
  <div class="card-container">
    <a-card size="small" id="special">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品特性</span>
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

      <a-form ref="formRef" :model="form" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <a-form-item label="保质期" name="code">
          <a-switch v-model:checked="form.enableShelfLife" />
        </a-form-item>
        <a-form-item label="辅助属性" name="code">
          <a-switch v-model:checked="form.enableAttr" />
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

  const formRef = ref();
  const formDefault = {
    spuId: undefined,
    enableShelfLife: false,
    enableAttr: false,
    shelfLifeType: 1,
    shelfLifeDays: 30,
  };

  let form = reactive(_.cloneDeep(formDefault));

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      form.spuId = rawData.id;
      form.enableShelfLife = rawData.enableShelfLife;
      form.enableAttr = rawData.enableAttr;
      form.shelfLifeType = rawData.shelfLifeType;
      form.shelfLifeDays = rawData.shelfLifeDays;
    }
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        await spuApi.updateSpuImages(form);
      }

      message.success('操作成功');
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
