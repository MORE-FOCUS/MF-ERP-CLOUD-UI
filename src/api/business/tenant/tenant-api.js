/**
 * 租户 api 封装
 *
 * @author:    loki
 * @date:      2024-04-09 00:06:01
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const tenantApi = {

  /**
   * 分页查询  @author  loki
   */
  queryPage : (param) => {
    return postRequest('/tenant/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
      return postRequest('/tenant/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
      return postRequest('/tenant/update', param);
  },


  /**
   * 删除  @author  loki
   */
  delete: (id) => {
      return getRequest(`/ttenant/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
      return postRequest('/ttenant/batchDelete', idList);
  },

};
