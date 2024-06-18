/*
 * 单号规则
 */
export const RULE_TYPE_ENUM = {
  NONE: {
    value: 'none',
    desc: '没有周期',
  },
  YEAR: {
    value: 'year',
    desc: '年周期',
  },
  MONTH: {
    value: 'month',
    desc: '月周期',
  },
  DAY: {
    value: 'day',
    desc: '日周期',
  },
};

export const SERIAL_NUMBER_ID_ENUM = {
  GYS: {
    value: '1',
    desc: '供应商',
  },
  SPBM: {
    value: '2',
    desc: '商品编码',
  },
  DEPT: {
    value: '3',
    desc: '部门编码',
  },
  CK: {
    value: '4',
    desc: '仓库编码',
  },
  SKU: {
    value: '5',
    desc: 'SKU编码',
  },
  BARCODE: {
    value: '6',
    desc: '条形码',
  },
};

export default {
  RULE_TYPE_ENUM,
  SERIAL_NUMBER_ID_ENUM,
};
