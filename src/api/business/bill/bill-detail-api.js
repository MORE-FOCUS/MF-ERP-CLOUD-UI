/**
 * 单据明细 api 封装
 *
 * @author:    loki
 * @date:      2024-07-04 23:47:57
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const billDetailApi = {

  /**
   * 分页查询  @author  loki
   */
  queryPage : (param) => {
    return postRequest('/billDetail/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
      return postRequest('/billDetail/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
      return postRequest('/billDetail/update', param);
  },



};
