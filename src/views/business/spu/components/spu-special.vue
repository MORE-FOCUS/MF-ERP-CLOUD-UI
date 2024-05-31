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
          <div style="display: flex; align-items: center">
            <div style="margin-right: 20px">
              <a-switch v-model:checked="form.enableShelfLife" />
            </div>
            <div v-if="form.enableShelfLife" style="margin-right: 20px; display: flex">
              <div style="margin-right: 20px">
                <a-input-number v-model:value="form.shelfLifeDays" placeholder="请输入保质期" />
              </div>
              <div style="margin-right: 20px">
                <DictSelect key-code="SHELF_LIFE_TYPE" v-model:value="form.shelfLifeType" width="100px" placeholder="天/月/年" />
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="辅助属性" name="enableAttr">
          <a-switch v-model:checked="form.enableAttr" />
        </a-form-item>
        <a-form-item label="属性配置" v-if="form.enableAttr">
          <a-checkbox-group v-model:value="checkedCategoryList" :options="categoryList" />
        </a-form-item>
        <a-form-item :label="item.categoryName" v-for="item in categoryAttrsList" v-if="form.enableAttr">
          <a-checkbox-group v-model:value="item.checkedAttrsList" :options="item.attrsList" />
        </a-form-item>
        <a-form-item label="属性组合" v-if="form.enableAttr">
          <a-button type="primary" size="small" style="margin-bottom: 10px" @click="reBuild">重新生成</a-button>
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
              <template v-if="column.dataIndex === 'skuNo'">
                <a-input v-model:value="record.skuNo" />
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
  import { ref, reactive, watch, computed } from 'vue';
  import _ from 'lodash';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { smartSentry } from '/@/lib/smart-sentry';
  import { message } from 'ant-design-vue';
  import { spuApi } from '/src/api/business/spu/spu-api';
  import DictSelect from '/@/components/support/dict-select/index.vue';
  import { categoryApi } from '/src/api/business/category/category-api';
  import { attrsApi } from '/src/api/business/attrs/attrs-api';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';

  const originalCategoryList = ref([]);
  const checkedCategoryList = ref([]);
  const categoryAttrsList = ref([]);
  const tableData = ref();

  const columns = ref([
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '辅助属性',
      dataIndex: 'attrs',
      align: 'center',
      width: 100,
    },
    {
      title: 'SKU编码',
      dataIndex: 'skuNo',
      align: 'center',
      width: 200,
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
    enableShelfLife: false,
    enableAttr: false,
    shelfLifeType: String(1),
    shelfLifeDays: 30,
  };

  let form = reactive(_.cloneDeep(formDefault));

  function updateData(rawData) {
    Object.assign(form, formDefault);
    if (rawData) {
      form.spuId = rawData.id;
      form.enableShelfLife = rawData.enableShelfLife;
      form.enableAttr = rawData.enableAttr;
      form.shelfLifeType = String(rawData.shelfLifeType);
      form.shelfLifeDays = rawData.shelfLifeDays;
    }
  }

  watch(
    () => form.enableAttr,
    (newValue) => {
      if (newValue) {
        queryCategoryList();
      }
    }
  );

  const categoryList = computed(() => originalCategoryList.value.map((item) => item.categoryName));

  //获取辅助属性类别
  async function queryCategoryList() {
    let params = {
      isDisabled: false,
      isDeleted: false,
      categoryType: CATEGORY_TYPE_ENUM.ATTRS.value,
    };

    const res = await categoryApi.queryAll(params);
    if (res.data) {
      Promise.all(res.data.map((category) => queryAttrsList(category))).then((value) => {
        originalCategoryList.value = value;
      });
    } else {
      originalCategoryList.value = [];
    }
  }

  //属性
  async function queryAttrsList(category) {
    let params = {
      isDisabled: false,
      isDeleted: false,
      categoryId: category.categoryId,
    };

    const res = await attrsApi.queryAll(params);

    return {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      attrsList: res.data,
      checkedAttrsList: [],
    };
  }

  watch(
    () => checkedCategoryList.value,
    (checkedCategoryList) => {
      buildAttrs(checkedCategoryList);
    }
  );

  function buildAttrs(checkedCategoryList) {
    categoryAttrsList.value = [];
    originalCategoryList.value.forEach((category) => {
      if (checkedCategoryList.includes(category.categoryName)) {
        categoryAttrsList.value.push({
          categoryId: category.categoryId,
          categoryName: category.categoryName,
          attrsList: category.attrsList.map((a) => a.name),
          checkedAttrsList: [],
        });
      }
    });
  }

  function reBuild() {
    const columnTitle = ['序号', '辅助属性', 'SKU编码'];

    //组装columns
    //序号 颜色 尺码 辅助属性 SKU编码
    columnTitle.splice(1, 0, ...checkedCategoryList.value);
    columns.value = columnTitle.map((item) =>
      Object.assign(
        {},
        {
          title: item,
          dataIndex: item,
          ellipsis: true,
          align: 'center',
        }
      )
    );

    //组装tableData
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        await spuApi.updateSpuSpecial(form);
      }

      message.success('商品特性保存成功');
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
