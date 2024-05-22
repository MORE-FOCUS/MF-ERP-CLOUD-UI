<!--
  * 商品表单
-->
<template>
  <a-drawer :title="form.spuId ? '编辑' : '添加'" width="65%" :open="visible" @close="onClose">
    <div style="margin-top: -20px">
      <a-menu v-model:selectedKeys="selectedKeys" mode="horizontal" @select="onMenuSelect">
        <a-menu-item v-for="item in menuList" :key="item.key">{{ item.value }}</a-menu-item>
      </a-menu>

      <!-- 基本信息 -->
      <div id="container" @scroll="scrollChange" class="container">
        <SpuBase :spuData="spuData"/>
        <!-- 商品单位 -->
        <SpuBaseUnit></SpuBaseUnit>
        <!-- 图片附件 -->
        <SpuBaseImg></SpuBaseImg>
        <!-- 商品特性 -->
        <SpuSpecial></SpuSpecial>
        <!-- 商品条码 -->
        <SpuBarcode></SpuBarcode>
        <!-- 价格管理 -->
        <SpuPrice></SpuPrice>
        <!-- 期初库存 -->
        <SpuStock></SpuStock>
        <!-- 库存预警 -->
        <SpuStockWarn></SpuStockWarn>
      </div>
    </div>
    <!-- <div class="footer">
      <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
      <a-button type="primary" style="margin-right: 8px" @click="onSubmit(false)">保存</a-button>
      <a-button v-if="!form.supplierId" type="primary" @click="onSubmit(true)">保存并继续添加</a-button>
    </div> -->
  </a-drawer>
</template>
<script setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import _ from 'lodash';
  import { spuApi } from '/@/api/business/spu/spu-api';
  import { smartSentry } from '/@/lib/smart-sentry';
  import SpuBase from './spu-base.vue';
  import SpuBaseImg from './spu-base-img.vue';
  import SpuSpecial from './spu-special.vue';
  import SpuBarcode from './spu-barcode.vue';
  import SpuPrice from './spu-price.vue';
  import SpuStock from './spu-stock.vue';
  import SpuStockWarn from './spu-stock-warn.vue';
  import SpuBaseUnit from './spu-base-unit.vue';

  // emit
  const emit = defineEmits(['reloadList']);

  const selectedKeys = ref(['base']);

  // 组件ref
  const formRef = ref();

  const defaultForm = {
    //商品id
    id: undefined,
  };

  //菜单
  const menuList = ref([
    {
      key: 'base',
      value: '基本信息',
    },
    {
      key: 'baseUnit',
      value: '商品单位',
    },
    {
      key: 'baseImg',
      value: '商品图片',
    },
    {
      key: 'special',
      value: '商品特性',
    },
    {
      key: 'barcode',
      value: '商品条码',
    },
    {
      key: 'price',
      value: '商品价格',
    },
    {
      key: 'stock',
      value: '期初库存',
    },
    {
      key: 'stockWarn',
      value: '库存预警',
    },
  ]);

  let form = reactive({ ...defaultForm });

  // 是否展示抽屉
  const visible = ref(false);

  function showDrawer(rowData) {
    visible.value = true;

    queryDetail(rowData);
  }

  const spuData = ref();

  //查询商品详情
  async function queryDetail(data) {
    if (data && data.id) {
      SmartLoading.show();
      try {
        const res = await spuApi.queryDetail(data.id);
        spuData.value = res.data;
      } catch (error) {
        smartSentry.captureError(error);
      } finally {
        SmartLoading.hide();
      }
    }
  }

  function onClose() {
    Object.assign(form, defaultForm);
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

  //菜单选择
  function onMenuSelect(item) {
    const element = document.getElementById(item.key);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  //滚动事件
  function scrollChange(e) {
    // 当前顶部值，向上取整
    let currentTop = Math.ceil(e.srcElement.scrollTop);
    console.log(currentTop);
  }

  defineExpose({
    showDrawer,
  });
</script>

<style scoped lang="less">
  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: left;
    z-index: 1;
  }
  .container {
    max-height: 830px;
    overflow-y: scroll;
  }
</style>
