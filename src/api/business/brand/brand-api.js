/**
 * 品牌 api 封装
 *
 * @author:    loki
 * @date:      2024-04-16 23:57:58
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const brandApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/brand/queryPage', param);
  },

  /**
   * 查询所有  @author  loki
   */
  queryAll: (param) => {
    return postRequest('/brand/queryAll', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/brand/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/brand/update', param);
  },

  /**
   * 更新禁用状态
   */
  updateDisabled: (id) => {
    return postRequest(`/brand/disabled/${id}`);
  },
};
