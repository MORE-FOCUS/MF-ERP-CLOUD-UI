/**
 * 单据操作记录
 api 封装
 *
 * @author:    loki
 * @date:      2024-07-04 23:57:01
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const billDetailOperateLogApi = {

  /**
   * 分页查询  @author  loki
   */
  queryPage : (param) => {
    return postRequest('/billDetailOperateLog/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
      return postRequest('/billDetailOperateLog/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
      return postRequest('/billDetailOperateLog/update', param);
  },



};
