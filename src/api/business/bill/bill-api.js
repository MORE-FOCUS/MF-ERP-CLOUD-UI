/**
 * 单据 api 封装
 *
 * @author:    loki
 * @date:      2024-07-04 23:20:21
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const billApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/bill/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/bill/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/bill/update', param);
  },

  /**
   * 采购订单
   */
  queryPoPage: (param) => {
    return postRequest('/po/queryPage', param);
  },

};
