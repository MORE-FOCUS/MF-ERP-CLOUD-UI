//system系统功能表格初始化id
let systemInitTableId = 10000;

//support支撑功能表格初始化id
let supportInitTableId = 20000;

//业务表格初始化id
let businessInitTableId = 30000;

export const TABLE_ID_CONST = {
  /**
   * 业务
   */
  BUSINESS: {
    GOODS: businessInitTableId + 1, //商品管理
    GOODS_CATEGORY: businessInitTableId + 2, //商品类目列表
    SUPPLIER: businessInitTableId + 3, //供应商列表
    UNIT: businessInitTableId + 3, //单位列表
  },

  /**
   * 系统
   */
  SYSTEM: {
    EMPLOYEE: systemInitTableId + 1, //员工
    MENU: systemInitTableId + 2, //菜单
    DEPARTMENT: systemInitTableId + 3, //组织机构树
  },

  /**
   * 支撑
   */
  SUPPORT: {
    CONFIG: supportInitTableId + 1, //参数配置
    DICT: supportInitTableId + 2, //字典
    SERIAL_NUMBER: supportInitTableId + 3, //单号
    OPERATE_LOG: supportInitTableId + 4, //请求监控
    HEART_BEAT: supportInitTableId + 5, //心跳
    LOGIN_LOG: supportInitTableId + 6, //登录日志
    RELOAD: supportInitTableId + 7, //reload
    HELP_DOC: supportInitTableId + 8, //帮助文档
  },
};
