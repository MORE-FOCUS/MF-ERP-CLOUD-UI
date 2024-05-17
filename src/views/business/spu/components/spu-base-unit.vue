<template>
  <a-card title="| 商品单位" headStyle="color: #f90; font-size:15px;" id="baseImg" style="margin-top: 10px; margin-right: 15px">
    <a-form ref="formRef" :model="form" :rules="rules" layout="horizontal" :label-col="{ span: 2 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="基础单位" name="unitId">
        <UnitSelect v-model:value="form.unitId" width="50%" />
      </a-form-item>
      <a-form-item label="多单位" name="enableMultiUnit">
        <a-switch v-model:checked="form.enableMultiUnit" />
      </a-form-item>
      <a-table
        v-if="form.enableMultiUnit"
        size="small"
        :dataSource="tableData"
        :columns="columns"
        rowKey="id"
        bordered
        :pagination="false"
        :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }"
      >
        <template #bodyCell="{ index, record, column }">

          <template v-if="column.dataIndex === 'no'">
            {{ index + 1 }}
          </template>
          <template v-if="column.dataIndex === 'isDisabled'">
            <a-switch :checked="!record.isDisabled" @change="updateDisabled(record.id, record.isDisabled)" />
          </template>
          <template v-if="column.dataIndex === 'action'">
            <div class="smart-table-operate">
              <a-button @click="addSpu(record)" type="link" v-privilege="'business:spu:update'">编辑</a-button>
              <a-button @click="deleteSpu(record)" danger type="link" v-privilege="'business:spu:delete'">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </a-form>
  </a-card>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import _ from 'lodash';
  import { spuUnitApi } from '/src/api/business/spuunit/spu-unit-api';
  import UnitSelect from '/@/components/business/unit-select/index.vue';
  import { message } from 'ant-design-vue';

  const columns = ref([
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
    },
    {
      title: '基础单位',
      dataIndex: 'baseUnit',
      align: 'center',
    },
    {
      title: '辅助单位',
      dataIndex: 'assistUnit',
      align: 'center',
    },
    {
      title: '换算关系',
      dataIndex: 'exchange',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'isDisabled',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      align: 'center',
      width: 100,
    },
  ]);
  const rules = {
    unitId: [{ required: true, message: '基础单位不能为空' }],
  };

  const formRef = ref();
  const formDefault = {
    unitId: undefined,
  };

  let form = reactive(_.cloneDeep(formDefault));

  function querySpuUnit() {}
</script>
