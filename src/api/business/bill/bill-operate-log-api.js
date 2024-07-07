/**
 * 单据操作记录
 api 封装
 *
 * @author:    loki
 * @date:      2024-07-04 23:55:25
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const billOperateLogApi = {

  /**
   * 分页查询  @author  loki
   */
  queryPage : (param) => {
    return postRequest('/billOperateLog/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
      return postRequest('/billOperateLog/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
      return postRequest('/billOperateLog/update', param);
  },



};
