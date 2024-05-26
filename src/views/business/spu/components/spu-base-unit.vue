<template>
  <div class="card-container">
    <a-card size="small" id="baseUnit">
      <template #title>
        <div class="title">
          <span class="smart-margin-left10">商品单位</span>
        </div>
      </template>
      <template #extra v-if="form.spuId">
        <a-button type="link" @click="extraClick">
          <template #icon>
            <SaveOutlined />
          </template>
          保存
        </a-button>
      </template>
      <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
        <a-form-item label="多单位" name="enableMultiUnit">
          <a-switch v-model:checked="form.enableMultiUnit" />
        </a-form-item>
        <a-form-item label="单位配置" name="enableMultiUnit" v-if="form.enableMultiUnit">
          <a-button type="primary" size="small" style="margin-bottom: 10px" @click="addRow">新增</a-button>
          <a-table
            style="width: 100%"
            size="small"
            :dataSource="tableData"
            :columns="columns"
            rowKey="id"
            bordered
            :pagination="false"
            :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }"
          >
            <template #bodyCell="{ index, record, column }">
              <template v-if="column.dataIndex === 'exchange'">
                <a-input-number v-model:value="record.exchange" @change="onExchangeChange(record)" />
              </template>
              <template v-if="column.dataIndex === 'unitName'">
                <UnitSelect v-model:value="record.unitId" @change="onUnitChange(record)" />
              </template>
              <template v-if="column.dataIndex === 'isDisabled'">
                <a-switch :checked="!record.isDisabled" v-model:value="record.isDisabled" @change="onDisabledChange(record)"/>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <div class="smart-table-operate">
                  <a-button @click="deleteRow(index)" danger type="link">删除</a-button>
                </div>
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
  import { spuApi } from '/src/api/business/spu/spu-api';
  import UnitSelect from '/@/components/business/unit-select/index.vue';
  import { message } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { unitApi } from '/src/api/business/unit/unit-api';

  const columns = ref([
    {
      title: '基础单位',
      dataIndex: 'basicUnitName',
      align: 'center',
      width: 140,
    },
    {
      title: '辅助单位',
      dataIndex: 'unitName',
      align: 'center',
      width: 140,
    },
    {
      title: '换算关系',
      dataIndex: 'exchange',
      align: 'center',
      width: 140,
    },
    {
      title: '说明',
      dataIndex: 'remark',
      align: 'center',
    },
    {
      title: '启用',
      dataIndex: 'isDisabled',
      align: 'center',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 100,
    },
  ]);

  const formRef = ref();
  const formDefault = {
    spuId: undefined,
    enableMultiUnit: false,
    multiUnitList: [],
  };

  let form = reactive(_.cloneDeep(formDefault));

  const tableData = ref([]);

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      form.baseUnitId = rawData.unitId;
      form.baseUnitName = rawData.unitName;
      form.spuId = rawData.id;
      form.enableMultiUnit = rawData.enableMultiUnit;
      tableData.value = rawData.multiUnitList;
    }

    queryUnit();
  }

  const unitList = ref([]);
  async function queryUnit() {
    try {
      let params = { isDisabled: false };

      let resp = await unitApi.queryAll(params);
      unitList.value = resp.data;
    } catch (e) {
      smartSentry.captureError(e);
    }
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        form.multiUnitList = tableData.value;
        await spuApi.updateSpuUnit(form);
      }

      message.success('操作成功');
    } catch (err) {
      smartSentry.captureError(err);
    } finally {
      SmartLoading.hide();
    }
  }

  function addRow() {
    const newRow = {
      index: undefined,
      spuId: form.spuId,
      basicUnitId: form.baseUnitId,
      basicUnitName: form.baseUnitName,
      unitId: undefined,
      unitName: undefined,
      exchange: 1,
      isDisabled: false,
      remark: undefined,
    };
    tableData.value.push(newRow);
  }

  function deleteRow(index) {
    tableData.value.splice(index);
  }

  function onExchangeChange(record) {
    if (record.unitId) {
      record.unitName = unitList.value.find((item) => item.id === record.unitId).name;
      record.remark = '1' + record.unitName + '/' + record.exchange + record.basicUnitName;
    }
  }

  function onUnitChange(record) {
    if (record.unitId) {
      record.unitName = unitList.value.find((item) => item.id === record.unitId).name;
      record.remark = '1' + record.unitName + '/' + record.exchange + record.basicUnitName;
    }
  }

  function onDisabledChange(record){
    record.isDisabled = !record.isDisabled;
  }

  defineExpose({
    updateData,
  });
</script>

<style lang="less" scoped>
  .card-container {
    background-color: #fff;
    height: 100%;
    margin-top: 15px;
    margin-right: 15px;

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
