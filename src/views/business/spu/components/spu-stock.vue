<template>
  <div class="card-container">
    <a-card size="small" id="stock">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">期初库存</span>
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
        <a-form-item label="初始库存" name="code">
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
              <template v-if="column.dataIndex === 'warehouseName'">
                <a-select v-model:value="record.warehouseId" showSearch="true" allowClear="true">
                  <a-select-option v-for="item in warehouseList" :key="item.id" :value="item.id">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </template>
              <template v-if="column.dataIndex === 'quantity'">
                <a-input-number v-model:value="record.quantity" :precision="2" :min="0" @change="onQuantityChange(record)" />
              </template>
              <template v-if="column.dataIndex === 'price'">
                <a-input-number v-model:value="record.price" :precision="2" :min="0" @change="onPriceChange(record)" />
              </template>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue';
  import _ from 'lodash';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { message } from 'ant-design-vue';
  import { spuApi } from '/src/api/business/spu/spu-api';
  import { warehouseApi } from '/src/api/business/warehouse/warehouse-api';

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
      title: '门店',
      dataIndex: 'storeName',
      align: 'center',
      width: 100,
    },
    {
      title: '仓库',
      dataIndex: 'warehouseName',
      align: 'center',
      width: 100,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      align: 'center',
      width: 100,
    },
    {
      title: '单价',
      dataIndex: 'price',
      align: 'center',
      width: 100,
    },
    {
      title: '总金额',
      dataIndex: 'amount',
      align: 'center',
      width: 100,
    },
  ];

  const formDefault = {
    spuId: undefined,
    unitId: undefined,
    unitName: undefined,
    enableBarcode: false,
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

    buildTableColumns();

    buildTableDataList();
  }

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
            width: 60,
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
      const data = sku.initialStock;

      //商品特性
      if (form.enableAttr) {
        for (let index = 0; index < sku.attrsList.length; index++) {
          data['attrs' + index] = sku.attrsList[index].name;
        }
      }

      return data;
    });

    tableData.value = dataList;
  }

  function onQuantityChange(data) {
    calculateAmount(data);
  }

  function onPriceChange(data) {
    calculateAmount(data);
  }

  function calculateAmount(data) {
    if (!data.quantity) {
      data.quantity = 0;
    }

    if (!data.price) {
      data.price = 0;
    }

    data.amount = data.price * data.quantity;
  }

  onMounted(getWarehouseList);

  const warehouseList = ref([]);
  async function getWarehouseList() {
    try {
      let resp = await warehouseApi.queryAll({ isDisabled: false });
      warehouseList.value = resp.data;
    } catch (e) {
      smartSentry.captureError(e);
    }
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        const data = {
          spuId: form.spuId,
          initialStockList: tableData.value,
        };
        await spuApi.updateSpuInitialStock(data);
      }

      message.success('商品初始库存保存成功');
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
