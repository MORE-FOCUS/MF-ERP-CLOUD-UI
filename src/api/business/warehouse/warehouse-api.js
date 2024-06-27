/**
 * 仓库 api 封装
 *
 * @author:    loki
 * @date:      2024-04-16 23:57:58
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const warehouseApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/warehouse/queryPage', param);
  },

  /**
   * 分页查询  @author  loki
   */
  queryAll: (param) => {
    return postRequest('/warehouse/queryAll', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/warehouse/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/warehouse/update', param);
  },

  /**
   * 更新禁用状态
   */
  updateDisabled: (id) => {
    return postRequest(`/warehouse/disabled/${id}`);
  },
};
