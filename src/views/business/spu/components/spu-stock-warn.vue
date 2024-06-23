<template>
  <div class="card-container">
    <a-card size="small" id="stockWarn">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">库存预警</span>
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
          <a-switch v-model:checked="form.enableStockWarn" />
        </a-form-item>

        <a-form-item label="商品条码" name="code" v-if="form.enableStockWarn">
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
                <a-space direction="vertical">
                  <div v-for="item in record.barcodeList">
                    <a-input-group>
                      <a-input style="width: 15%; color: #c0c4cc" readonly v-model:value="item.unitName" />
                      <a-input style="width: 75%;" v-model:value="item.barcode" />
                    </a-input-group>
                  </div>
                </a-space>
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
  import { watch } from 'vue';

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
    unitId: undefined,
    unitName: undefined,
    enableStockWarn: false,
    enableAttr: false,
    skuList: [],
    attrsList: [],
    unitId: undefined,
    unitName: undefined,
    enableMultiUnit: false,
    unitList: [],
  };
  let form = reactive(_.cloneDeep(formDefault));

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      Object.assign(form, rawData);
      form.spuId = rawData.id;
    }
  }

  watch(
    () => form.enableStockWarn,
    (newValue) => {
      if (newValue) {
        buildTableColumns();

        buildTableDataList();
      }
    }
  );

  function buildTableColumns() {
    Object.assign(dynamicColumns.value, columns);

    if (form.enableAttr) {
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
  }

  //构建表格数据
  async function buildTableDataList() {
    if (!form.skuList) {
      return;
    }

    const dataList = form.skuList.map((sku) => {
      const data = {
        barcodeList: [],
        spuId: form.spuId,
        skuId: sku.id,
      };

      //商品特性
      if (form.enableAttr) {
        for (let index = 0; index < sku.attrsList.length; index++) {
          data['attrs' + index] = sku.attrsList[index].name;
        }
      }

      //基础单位
      data.barcodeList.push(getBarcodeItem(sku, form.spuId, form.unitId, form.unitName));

      //开启了多单位
      if (form.enableMultiUnit) {
        //多单位,unitList不包含基础单位
        form.unitList.forEach((unit) => {
          data.barcodeList.push(getBarcodeItem(sku, form.spuId, unit.unitId, unit.unitName));
        });
      }

      return data;
    });

    const barcodeList = dataList.reduce((pre, cur) => {
      return pre.concat(cur.barcodeList.filter((item) => !item.barcode));
    }, []);

    //生成条形码
    if (barcodeList.length > 0) {
      const res = await serialNumberApi.generateMulti({ serialNumberId: SERIAL_NUMBER_ID_ENUM.BARCODE.value, count: barcodeList.length });
      const barcodes = res.data;

      let index = 0;
      dataList.forEach((data) => {
        data.barcodeList.forEach((item) => {
          if (!item.barcode) {
            item.barcode = barcodes[index];
            index++;
          }
        });
      });
    }

    tableData.value = dataList;
  }

  function getBarcodeItem(sku, spuId, unitId, unitName) {
    if (sku.barcodeList) {
      const barcodeItem = sku.barcodeList.find((item) => item.unitId === form.unitId);
      if (barcodeItem) {
        return barcodeItem;
      }
    }

    return {
      spuId,
      skuId: sku.id,
      unitId,
      unitName,
      barcode: undefined,
    };
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        const barcodeList = tableData.value.reduce((pre, cur) => {
          return pre.concat(cur.barcodeList);
        }, []);

        const data = {
          spuId: form.spuId,
          enableStockWarn: form.enableStockWarn,
          barcodeList: barcodeList,
        };
        await spuApi.updateSpuBarcode(data);
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
