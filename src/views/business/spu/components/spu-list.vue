<!--
  * 商品列表
-->
<template>
  <!---------- 查询表单form begin ----------->
  <a-form class="smart-query-form">
    <a-row class="smart-query-form-row" v-privilege="'business:spu:query'">
      <a-form-item class="smart-query-form-item">
        <a-input style="width: 200px" v-model:value="queryForm.searchWord" placeholder="商品名称/编码" />
      </a-form-item>

      <!-- <a-form-item label="产地" name="place" class="smart-query-form-item">
        <DictSelect key-code="GODOS_PLACE" v-model:value="queryForm.place" width="120px" />
      </a-form-item> -->

      <a-form-item class="smart-query-form-item">
        <SmartEnumSelect enum-name="SPU_STATUS_ENUM" v-model:value="queryForm.status" width="150px" placeholder="状态" />
      </a-form-item>

      <a-form-item class="smart-query-form-item">
        <a-radio-group v-model:value="queryForm.isListed" @change="onSearch">
          <a-radio-button :value="undefined">全部</a-radio-button>
          <a-radio-button :value="true">上架</a-radio-button>
          <a-radio-button :value="false">下架</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item class="smart-query-form-item">
        <a-button type="primary" @click="onSearch" v-privilege="'business:spu:query'">
          <template #icon>
            <SearchOutlined />
          </template>
          查询
        </a-button>
        <a-button @click="resetQuery" class="smart-margin-left10" v-privilege="'business:spu:query'">
          <template #icon>
            <ReloadOutlined />
          </template>
          重置
        </a-button>
      </a-form-item>
    </a-row>
  </a-form>
  <!---------- 查询表单form end ----------->

  <a-card size="small" :bordered="false" :hoverable="true">
    <!---------- 表格操作行 begin ----------->
    <a-row class="smart-table-btn-block">
      <div class="smart-table-operate-block">
        <a-button @click="addSpu" type="primary" size="small" v-privilege="'business:spu:add'">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>

        <a-button
          @click="confirmBatchDelete"
          danger
          size="small"
          :disabled="selectedRowKeyList.length === 0"
          v-privilege="'business:spu:batchDelete'"
        >
          <template #icon>
            <DeleteOutlined />
          </template>
          批量删除
        </a-button>

        <a-button @click="showImportModal" type="primary" size="small" v-privilege="'business:spu:importSpu'">
          <template #icon>
            <ImportOutlined />
          </template>
          导入
        </a-button>

        <a-button @click="onExportSpu" type="primary" size="small" v-privilege="'business:spu:exportSpu'">
          <template #icon>
            <ExportOutlined />
          </template>
          导出
        </a-button>
      </div>
      <div class="smart-table-setting-block">
        <TableOperator v-model="columns" :tableId="TABLE_ID_CONST.BUSINESS.SPU" :refresh="queryData" />
      </div>
    </a-row>
    <!---------- 表格操作行 end ----------->

    <a-table
      size="small"
      :dataSource="tableData"
      :columns="columns"
      rowKey="id"
      bordered
      :pagination="false"
      :row-selection="{ selectedRowKeys: selectedRowKeyList, onChange: onSelectChange }"
      :scroll="{ x: 1300 }"
    >
      <template #bodyCell="{ index, record, column }">
        <template v-if="column.dataIndex === 'no'">
          {{ index + 1 }}
        </template>
        <template v-if="column.dataIndex === 'mainPicture'">
          <a-popover placement="right">
            <template #content>
              <img
                src="https://zhjg.sz.gov.cn/zhcy/web/group2/M00/04/4A/CuIvUGHOvAKAFex4AABU7pg91qM129.jpg"
                style="width: 100px; height: 100px;"
              />
            </template>
            <img
              src="https://zhjg.sz.gov.cn/zhcy/web/group2/M00/04/4A/CuIvUGHOvAKAFex4AABU7pg91qM129.jpg"
              style="width: 30px; height: 30px;"
            />
          </a-popover>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <span>{{ $smartEnumPlugin.getDescByValue('SPU_STATUS_ENUM', record.status) }}</span>
        </template>
        <template v-if="column.dataIndex === 'isListed'">
          <span>{{ record.isListed ? '上架' : '下架' }}</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="smart-table-operate">
            <a-button @click="addSpu(record)" type="link" v-privilege="'business:spu:update'">编辑</a-button>
            <a-button @click="deleteSpu(record)" danger type="link" v-privilege="'business:spu:delete'">删除</a-button>
          </div>
        </template>
      </template>
    </a-table>

    <div class="smart-query-table-page">
      <a-pagination
        showSizeChanger
        showQuickJumper
        show-less-items
        :pageSizeOptions="PAGE_SIZE_OPTIONS"
        :defaultPageSize="queryForm.pageSize"
        v-model:current="queryForm.pageNum"
        v-model:pageSize="queryForm.pageSize"
        :total="total"
        @change="queryData"
        @showSizeChange="queryData"
        :show-total="(total) => `共${total}条`"
      />
    </div>

    <SpuFormModal ref="formModal" @reloadList="queryData" />

    <a-modal v-model:open="importModalShowFlag" title="导入" @onCancel="hideImportModal" @ok="hideImportModal">
      <div style="text-align: center; width: 400px; margin: 0 auto">
        <a-button @click="downloadExcel"> <download-outlined />第一步：下载模板</a-button>
        <br />
        <br />
        <a-upload
          v-model:fileList="fileList"
          name="file"
          :multiple="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          accept=".xls,.xlsx"
          :before-upload="beforeUpload"
          @remove="handleRemove"
        >
          <a-button>
            <upload-outlined />
            第二步：选择文件
          </a-button>
        </a-upload>

        <br />
        <a-button @click="onImportSpu">
          <ImportOutlined />
          第三步：开始导入
        </a-button>
      </div>
    </a-modal>
  </a-card>
</template>
<script setup>
  import SpuFormModal from './spu-form-modal.vue';
  import { reactive, ref, onMounted } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { SmartLoading } from '/@/components/framework/smart-loading';
  import { spuApi } from '/@/api/business/spu/spu-api';
  import { PAGE_SIZE_OPTIONS } from '/@/constants/common-const';
  import { smartSentry } from '/@/lib/smart-sentry';
  import TableOperator from '/@/components/support/table-operator/index.vue';
  import { TABLE_ID_CONST } from '/@/constants/support/table-id-const';
  import { SPU_STATUS_ENUM } from '/@/constants/business/spu/spu-const';
  import DictSelect from '/@/components/support/dict-select/index.vue';
  import SmartEnumSelect from '/@/components/framework/smart-enum-select/index.vue';
  import { FILE_FOLDER_TYPE_ENUM } from '/@/constants/support/file-const.js';
  import FileUpload from '/@/components/support/file-upload/index.vue';

  // ---------------------------- 表格列 ----------------------------

  const columns = ref([
    {
      title: '序号',
      dataIndex: 'no',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      align: 'center',
      fixed: 'left'
    },
    {
      title: '图片',
      dataIndex: 'mainPicture',
      align: 'center',
      width: 60,
      fixed: 'left'
    },
    {
      title: '商品规格',
      dataIndex: 'specs',
      align: 'center',
    },
    {
      title: '产地',
      dataIndex: 'place',
      align: 'center',
    },
    {
      title: '商品状态',
      dataIndex: 'status',
      align: 'center',
    },
    {
      title: '零售价',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: '计量单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '上架状态',
      dataIndex: 'isListed',
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

  // ---------------------------- 查询数据表单和方法 ----------------------------

  const defaultQueryForm = {
    categoryId: undefined,
    searchWord: '',
    status: undefined,
    place: undefined,
    isListed: undefined,
    pageNum: 1,
    pageSize: 10,
  };
  // 查询表单form
  const queryForm = reactive({ ...defaultQueryForm });
  // 表格加载loading
  const tableLoading = ref(false);
  // 表格数据
  const tableData = ref([]);
  // 总数
  const total = ref(0);

  // 重置查询条件
  function resetQuery() {
    let pageSize = queryForm.pageSize;
    Object.assign(queryForm, defaultQueryForm);
    queryForm.pageSize = pageSize;
    queryData();
  }

  // 搜索
  function onSearch() {
    queryForm.pageNum = 1;
    queryData();
  }

  // 查询数据
  async function queryData() {
    tableLoading.value = true;
    try {
      let queryResult = await spuApi.querySpuList(queryForm);

      tableData.value = queryResult.data.list;
      total.value = queryResult.data.total;
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      tableLoading.value = false;
    }
  }

  onMounted(queryData);

  // ---------------------------- 添加/修改 ----------------------------
  const formModal = ref();

  function addSpu(data) {
    formModal.value.showDrawer(data);
  }
  // ---------------------------- 单个删除 ----------------------------

  function deleteSpu(data) {
    Modal.confirm({
      title: '提示',
      content: '确定要删除【' + data.name + '】吗?',
      okText: '删除',
      okType: 'danger',
      onOk() {
        singleDelete(data);
      },
      cancelText: '取消',
      onCancel() {},
    });
  }

  async function singleDelete(data) {
    try {
      SmartLoading.show();
      await spuApi.deleteSpu(data.id);
      message.success('删除成功');
      queryData();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }

  // ---------------------------- 批量删除 ----------------------------

  // 选择表格行
  const selectedRowKeyList = ref([]);

  function onSelectChange(selectedRowKeys) {
    selectedRowKeyList.value = selectedRowKeys;
  }

  // 批量删除
  function confirmBatchDelete() {
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中商品吗?',
      okText: '删除',
      okType: 'danger',
      onOk() {
        batchDelete();
      },
      cancelText: '取消',
      onCancel() {},
    });
  }

  async function batchDelete() {
    try {
      SmartLoading.show();
      await spuApi.batchDelete(selectedRowKeyList.value);
      message.success('删除成功');
      queryData();
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }

  // ------------------------------- 导出和导入 ---------------------------------
  // 导入弹窗
  const importModalShowFlag = ref(false);

  const fileList = ref([]);
  // 显示导入
  function showImportModal() {
    fileList.value = [];
    importModalShowFlag.value = true;
  }

  // 关闭 导入
  function hideImportModal() {
    importModalShowFlag.value = false;
  }

  function handleChange() {}

  function handleDrop() {}

  function handleRemove(file) {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
  }
  function beforeUpload(file) {
    fileList.value = [...(fileList.value || []), file];
    return false;
  }

  function downloadExcel() {
    window.open('');
  }

  async function onImportSpu() {
    const formData = new FormData();
    fileList.value.forEach((file) => {
      formData.append('file', file.originFileObj);
    });

    SmartLoading.show();
    try {
      let res = await spuApi.importSpu(formData);
      message.success(res.msg);
    } catch (e) {
      smartSentry.captureError(e);
    } finally {
      SmartLoading.hide();
    }
  }

  async function onExportSpu() {
    await spuApi.exportSpu();
  }
</script>
