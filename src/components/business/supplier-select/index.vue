<!--
  * 供应商下拉选择框
-->
<template>
  <a-select
    v-model:value="selectValue"
    :style="`width: ${width}`"
    :placeholder="props.placeholder"
    :showSearch="true"
    :allowClear="true"
    :size="size"
    @change="onChange"
  >
    <a-select-option v-for="item in supplierList" :key="item.id" :value="item.id">
      {{ item.name }}
    </a-select-option>

    <template #dropdownRender="{ menuNode: menu }">
      <v-nodes :vnodes="menu" />
      <a-divider style="margin: 4px 0" />
      <a-flex gap="small" justify="space-between" align="center">
        <a-button type="text" @click="addItem" style="width: 100%"><PlusOutlined /> 新增 </a-button>
        <a-button type="text" @click="moreItem" style="width: 100%"> 更多<EllipsisOutlined /> </a-button>
      </a-flex>
    </template>
  </a-select>
</template>

<script setup>
  import { onMounted, ref, watch, defineComponent } from 'vue';
  import { supplierApi } from '/src/api/business/supplier/supplier-api';
  import { smartSentry } from '/@/lib/smart-sentry';

  // =========== 属性定义 和 事件方法暴露 =============

  const props = defineProps({
    value: [Number, Array],
    placeholder: {
      type: String,
      default: '请选择',
    },
    width: {
      type: String,
      default: '100%',
    },
    size: {
      type: String,
      default: 'default',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  });

  const VNodes = defineComponent({
    props: {
      vnodes: {
        type: Object,
        required: true,
      },
    },
    render() {
      return this.vnodes;
    },
  });

  const emit = defineEmits(['update:value', 'change']);

  // =========== 查询数据 =============

  //列表数据
  const supplierList = ref([]);
  async function query() {
    try {
      let params = { isDisabled: props.isDisabled };

      let resp = await supplierApi.queryAll(params);
      supplierList.value = resp.data;
    } catch (e) {
      smartSentry.captureError(e);
    }
  }
  onMounted(query);

  // =========== 选择 监听、事件 =============

  const selectValue = ref(props.value);
  watch(
    () => props.value,
    (newValue) => {
      selectValue.value = newValue;
    }
  );

  function onChange(value) {
    emit('update:value', value);
    emit('change', value);
  }
</script>
