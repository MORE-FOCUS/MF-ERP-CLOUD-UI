<template>
  <div class="card-container">
    <a-card size="small" id="baseImg">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品图片</span>
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
      <a-form ref="formRef" :model="form" layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <FileUpload
          v-model:value="form.images"
          :maxUploadSize="maxUploadSize"
          buttonText="点击上传图片"
          :defaultFileList="[]"
          :multiple="true"
          :folder="FILE_FOLDER_TYPE_ENUM.COMMON.value"
        />
        <a-alert :closable="true" :message="tips" type="success" show-icon>
          <template #icon><smile-outlined /></template>
        </a-alert>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import FileUpload from '/@/components/support/file-upload/index.vue';
  import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const';
  import { spuApi } from '/src/api/business/spu/spu-api';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { message } from 'ant-design-vue';

  const formRef = ref();
  const formDefault = {
    spuId: undefined,
    images: '',
  };

  const maxUploadSize = 5;
  const tips = '支持.png|.jpg|.jpeg的图片类型，最多上传' + maxUploadSize + '张，建议单张图片不超过5M';
  let form = reactive(_.cloneDeep(formDefault));

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      form.spuId = rawData.id;
      form.images = rawData.images;
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
