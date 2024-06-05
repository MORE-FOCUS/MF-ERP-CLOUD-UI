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
          <a-checkbox-group v-model:value="item.selectedAttrsNameList" :options="item.attrsNameList" @change="attrsChanged(item)" />
        </a-form-item>
        <a-form-item label="属性组合" v-if="form.enableAttr">
          <a-button type="primary" size="small" style="margin-bottom: 10px" @click="confirmReBuildColumns">重新生成</a-button>
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
              <template v-if="column.dataIndex === 'skuNo'">
                <a-input v-model:value="record.skuNo" allowClear="true"/>
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
  import { message, Modal } from 'ant-design-vue';
  import { spuApi } from '/src/api/business/spu/spu-api';
  import DictSelect from '/@/components/support/dict-select/index.vue';
  import { categoryApi } from '/src/api/business/category/category-api';
  import { attrsApi } from '/src/api/business/attrs/attrs-api';
  import { CATEGORY_TYPE_ENUM } from '/@/constants/business/category/category-const';
  import { serialNumberApi } from '/@/api/support/serial-number-api';
  import { SERIAL_NUMBER_ID_ENUM } from '/@/constants/support/serial-number-const';

  const emits = defineEmits(['reloadDetail']);

  //原始的属性
  const originalCategoryList = ref([]);
  //['颜色','尺寸']
  const checkedCategoryList = ref([]);
  //选中的类目对应的属性列表
  const categoryAttrsList = ref([]);
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
      title: '辅助属性',
      dataIndex: 'attrsName',
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
  ];

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
      form.skuList = rawData.skuList;
      form.attrsList = rawData.attrsList;

      if (form.enableAttr) {
        buildColumns();

        queryCategoryList();

        //选中的类目
        checkedCategoryList.value = form.attrsList.map((item) => item.categoryName);
      }
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
    originalCategoryList.value = [];

    let params = {
      isDisabled: false,
      isDeleted: false,
      categoryType: CATEGORY_TYPE_ENUM.ATTRS.value,
    };

    const res = await categoryApi.queryAll(params);
    if (res.data) {
      Promise.all(res.data.map((category) => queryAttrsList(category))).then((value) => {
        originalCategoryList.value = value;

        //选中的属性
        if (form.attrsList) {
          categoryAttrsList.value = [];
          form.attrsList.forEach((item) => {
            const category = value.find((attrs) => attrs.categoryId === item.categoryId);
            if (category) {
              const data = {};
              Object.assign(data, category);
              data.selectedAttrsList = item.selectedAttrsList;
              data.selectedAttrsNameList = item.selectedAttrsList.map((item) => item.name);
              categoryAttrsList.value.push(data);
            }
          });
        }
      });
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
      selectedAttrsList: [],
      attrsNameList: res.data.map((a) => a.name),
      selectedAttrsNameList: [],
    };
  }

  watch(
    () => checkedCategoryList.value,
    (checkedCategoryList) => {
      categoryAttrsList.value = originalCategoryList.value.filter((category) => checkedCategoryList.includes(category.categoryName));
    }
  );

  //重新生成
  function confirmReBuildColumns() {
    Modal.confirm({
      title: '提示',
      content: '重新生成会清空已经生成的数据,是否继续?',
      okText: '继续',
      okType: 'danger',
      onOk() {
        reBuildColumns();
      },
      cancelText: '取消',
      onCancel() {},
    });
  }

  //组装属性表格列
  function buildDynamicColumns() {
    dynamicColumns.value = [];
    tableData.value = [];
    Object.assign(dynamicColumns.value, columns);

    const attrsColumns = checkedCategoryList.value.map((item, index) =>
      Object.assign(
        {},
        {
          title: item,
          dataIndex: 'attrs' + index,
          ellipsis: true,
          align: 'center',
          width: 100,
        }
      )
    );
    dynamicColumns.value.splice(1, 0, ...attrsColumns);
  }

  //生成
  function buildColumns() {
    buildDynamicColumns();

    tableData.value = form.skuList.map((sku) => {
      const data = {
        attrsName: sku.attrsList.map((item) => item.name).join(','),
        skuNo: sku.skuNo,
        attrsList: sku.attrsList
      };

      for (let index = 0; index < sku.attrsList.length; index++) {
        data['attrs' + index] = sku.attrsList[index].name;
      }

      return data;
    });
  }

  //重新生成
  async function reBuildColumns() {
    buildDynamicColumns();

    //笛卡尔乘积，计算规格
    let cartesian = (arr) => {
      if (arr.length < 2) {
        return arr[0] || [];
      }

      return [].reduce.call(arr, function (col, set) {
        let res = [];
        col.forEach((c) => {
          set.forEach((s) => {
            let t = [].concat(Array.isArray(c) ? c : [c]);
            t.push(s);
            res.push(t);
          });
        });
        return res;
      });
    };

    //组装tableData
    const skuList = cartesian(
      categoryAttrsList.value.filter((item) => item.selectedAttrsNameList.length > 0).map((item) => item.selectedAttrsNameList)
    );

    //生成SKU编码
    const skuNoRes = await serialNumberApi.generateMulti({ serialNumberId: SERIAL_NUMBER_ID_ENUM.SKU.value, count: skuList.length });
    const skuNoList = skuNoRes.data;

    //选择的属性
    const selectedAttrsList = [];
    categoryAttrsList.value.forEach((item) => {
      if (item.selectedAttrsList.length > 0) {
        item.selectedAttrsList.forEach((attrs) => {
          selectedAttrsList.push({ id: attrs.id, name: attrs.name });
        });
      }
    });

    tableData.value = skuList.map((sku, idx) => {
      const data = {
        attrsName: sku.join(','),
        skuNo: skuNoList[idx],
      };

      const attrsList = [];
      for (let index = 0; index < sku.length; index++) {
        data['attrs' + index] = sku[index];
        selectedAttrsList.forEach((item) => {
          if (item.name === sku[index]) {
            attrsList.push(item);
          }
        });
      }

      data.attrsList = attrsList;

      return data;
    });
  }

  async function extraClick() {
    SmartLoading.show();
    try {
      if (form.spuId) {
        form.attrsList = categoryAttrsList.value.filter((item) => item.selectedAttrsNameList.length > 0);

        form.skuList = tableData;

        await spuApi.updateSpuSpecial(form);
      }

      //触发父组件刷新
      emits('reloadDetail',form.spuId);

      message.success('商品特性保存成功');
    } catch (err) {
      smartSentry.captureError(err);
    } finally {
      SmartLoading.hide();
    }
  }

  function deleteRow(index) {
    tableData.value.splice(index);
  }

  function attrsChanged(data) {
    data.selectedAttrsList = data.attrsList.filter((item) => data.selectedAttrsNameList.includes(item.name));
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
