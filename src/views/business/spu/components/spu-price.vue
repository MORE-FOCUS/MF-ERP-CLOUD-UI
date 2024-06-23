<template>
  <div class="card-container">
    <a-card size="small" id="price">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品价格</span>
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
        <a-form-item label="商品价格" name="code">
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
              <template v-if="column.dataIndex === 'referencePurchasePrice'">
                <a-space direction="vertical">
                  <div v-for="item in record.priceList">
                    <a-input-number size="small" style="width: 100%;" v-model:value="item.referencePurchasePrice" :precision="2" :min="0">
                      <template #prefix>
                        <span style="color: #c0c4cc">{{ item.unitName }}</span>
                      </template>
                    </a-input-number>
                  </div>
                </a-space>
              </template>
              <template v-if="column.dataIndex === 'tradePrice'">
                <a-space direction="vertical">
                  <div v-for="item in record.priceList">
                    <a-input-number size="small" style="width: 100%;" v-model:value="item.tradePrice" :precision="2" :min="0">
                      <template #prefix>
                        <span style="color: #c0c4cc">{{ item.unitName }}</span>
                      </template>
                    </a-input-number>
                  </div>
                </a-space>
              </template>
              <template v-if="column.dataIndex === 'retailPrice'">
                <a-space direction="vertical">
                  <div v-for="item in record.priceList">
                    <a-input-number size="small" style="width: 100%;" v-model:value="item.retailPrice" :precision="2" :min="0">
                      <template #prefix>
                        <span style="color: #c0c4cc">{{ item.unitName }}</span>
                      </template>
                    </a-input-number>
                  </div>
                </a-space>
              </template>
              <template v-if="column.dataIndex === 'retailPriceMin'">
                <a-space direction="vertical">
                  <div v-for="item in record.priceList">
                    <a-input-number size="small" style="width: 100%;" v-model:value="item.retailPriceMin" :precision="2" :min="0">
                      <template #prefix>
                        <span style="color: #c0c4cc">{{ item.unitName }}</span>
                      </template>
                    </a-input-number>
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
      title: '参考进货价',
      dataIndex: 'referencePurchasePrice',
      align: 'center',
      width: 100,
    },
    {
      title: '批发价',
      dataIndex: 'tradePrice',
      align: 'center',
      width: 100,
    },
    {
      title: '零售价',
      dataIndex: 'retailPrice',
      align: 'center',
      width: 100,
    },
    {
      title: '最低零售价',
      dataIndex: 'retailPriceMin',
      align: 'center',
      width: 100,
    },
  ];

  const formDefault = {
    spuId: undefined,
    unitId: undefined,
    unitName: undefined,
    skuList: [],
    attrsList: [],
    unitId: undefined,
    unitName: undefined,
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

    if (form.attrsList) {
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
  function buildTableDataList() {
    if (!form.skuList) {
      return;
    }

    const dataList = form.skuList.map((sku) => {
      const data = {
        priceList: [],
        spuId: form.spuId,
        skuId: sku.id,
      };

      //商品特性
      if (sku.attrsList) {
        for (let index = 0; index < sku.attrsList.length; index++) {
          data['attrs' + index] = sku.attrsList[index].name;
        }
      }

      //基础单位
      data.priceList.push(getPriceItem(sku, form.spuId, form.unitId, form.unitName));

      //多单位,unitList不包含基础单位
      if (form.unitList) {
        form.unitList.forEach((unit) => {
          data.priceList.push(getPriceItem(sku, form.spuId, unit.unitId, unit.unitName));
        });
      }

      return data;
    });

    tableData.value = dataList;
  }

  function getPriceItem(sku, spuId, unitId, unitName) {
    if (sku.priceList) {
      const priceItem = sku.priceList.find((item) => item.unitId === form.unitId);
      if (priceItem) {
        return priceItem;
      }
    }

    return {
      spuId,
      skuId: sku.id,
      unitId,
      unitName,
      referencePurchasePrice: 1,
      tradePrice: 2,
      retailPrice: 3,
      retailPriceMin: 4,
    };
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        const priceList = tableData.value.reduce((pre, cur) => {
          return pre.concat(cur.priceList);
        }, []);

        const data = {
          spuId: form.spuId,
          priceList: priceList,
        };
        await spuApi.updateSpuPrice(data);
      }

      message.success('商品单价保存成功');
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
