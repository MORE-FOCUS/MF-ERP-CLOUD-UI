export const BILL_TYPE_ENUM = {
  /**
   * 单据类型
   * 101：购货订单
   * 102：购货单
   * 103：购货退货单
   * 201：销售订单
   * 202：销售单
   * 203：销售退货单
   */
  PO: {
    value: 101,
    desc: '购货订单',
  },
  PB: {
    value: 102,
    desc: '购货单',
  },
  POT: {
    value: 103,
    desc: '购货退货单',
  },
  SO: {
    value: 201,
    desc: '销售订单',
  },
  SB: {
    value: 202,
    desc: '销售单',
  },
  SOT: {
    value: 203,
    desc: '销售退货单',
  },
};
/*
 * 采购订单状态
 */
export const PO_BILL_STATE_ENUM = {
  //101-未入库 102-部分入库 103-全部入库 104-已关闭
  NOT_IN_STOCK: {
    value: 101,
    desc: '未入库',
  },
  SOME_IN_STOCK: {
    value: 102,
    desc: '部分入库',
  },
  ALL_IN_STOCK: {
    value: 103,
    desc: '全部入库',
  },
  CLOSED: {
    value: 104,
    desc: '已关闭',
  },
};

export const BILL_AUDIT_STATE_ENUM = {
  //0-未审核 1-已审核
  UN_AUDIT: {
    value: 0,
    desc: '未审核',
  },
  AUDITED: {
    value: 1,
    desc: '已审核',
  },
};

export const BILL_CHECK_STATE_ENUM = {
  //0-未核对 1-已核对
  UN_CHECK: {
    value: 0,
    desc: '未核对',
  },
  CHECKED: {
    value: 1,
    desc: '已核对',
  },
};

export default {
  BILL_TYPE_ENUM,
  PO_BILL_STATE_ENUM,
  BILL_AUDIT_STATE_ENUM,
  BILL_CHECK_STATE_ENUM
};
