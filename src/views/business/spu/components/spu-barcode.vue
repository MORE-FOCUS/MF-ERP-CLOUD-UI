<template>
  <div class="card-container">
    <a-card size="small" id="barcode">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品条码</span>
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
      <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <a-form-item label="开启" name="code">
          <a-switch v-model:checked="form.enableBarcode" />
        </a-form-item>

        <a-form-item label="商品条码" name="code" v-if="form.enableBarcode">
          <a-table
            style="width: 100%"
            size="small"
            :dataSource="tableData"
            :columns="dynamicColumns"
            rowKey="id"
            bordered
            :pagination="false"
            :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }"
          >
            <template #bodyCell="{ index, record, column }">
              <template v-if="column.dataIndex === 'no'">
                {{ index + 1 }}
              </template>
              <template v-if="column.dataIndex === 'barcode'">
                <a-input placeholder="条形码" v-model:value="barcodeList" for="item in record.barcodeList">
                  <template #prefix>
                    {{ item.unitName }}
                  </template>
                </a-input>
              </template>
            </template>
          </a-table>
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
  import { serialNumberApi } from '/@/api/support/serial-number-api';
  import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';

  const rules = ref([]);
  const formRef = ref();
  const tableData = ref([]);
  const dynamicColumns = ref([]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '条形码',
      dataIndex: 'barcode',
      align: 'center',
      width: 200,
    },
  ];

  const formDefault = {
    spuId: undefined,
    enableBarcode: false,
    skuList: [],
    attrsList: [],
    enableMultiUnit: false,
    multiUnitList: [],
  };
  let form = reactive(_.cloneDeep(formDefault));

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      Object.assign(form, rawData);
      form.spuId = rawData.id;
    }

    buildTableColumns();

    buildTableDataList();
  }

  function buildTableColumns() {
    Object.assign(dynamicColumns.value, columns);

    const attrsColumns = form.attrsList.map((item, index) =>
      Object.assign(
        {},
        {
          title: item.categoryName,
          dataIndex: 'attrs' + index,
          ellipsis: true,
          align: 'center',
          width: 100,
        }
      )
    );
    dynamicColumns.value.splice(1, 0, ...attrsColumns);
  }

  function buildTableDataList() {
    tableData.value = form.skuList.map((sku) => {
      const data = {
        barcodeList: sku.barcodeList,
        spuId: form.spuId,
        skuId: sku.id,
      };

      //商品特性
      for (let index = 0; index < sku.attrsList.length; index++) {
        data['attrs' + index] = sku.attrsList[index].name;
      }

      //商品多单位
      if (form.enableMultiUnit) {
        
      }

      return data;
    });
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        await spuApi.updateSpuBarcode(form);
      }

      message.success('商品条形码保存成功');
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
