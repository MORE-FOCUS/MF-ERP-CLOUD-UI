/**
 * 辅助属性 api 封装
 *
 * @author:    loki
 * @date:      2024-04-16 23:57:58
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const attrsApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/attrs/queryPage', param);
  },

  /**
   * 查询所有  @author  loki
   */
  queryAll: (param) => {
    return postRequest('/attrs/queryAll', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/attrs/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/attrs/update', param);
  },

  /**
   * 更新禁用状态
   */
  updateDisabled: (id) => {
    return postRequest(`/attrs/disabled/${id}`);
  },
};
