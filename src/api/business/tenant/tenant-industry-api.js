/**
 * 租户所属行业 api 封装
 *
 * @author:    loki
 * @date:      2024-04-09 00:06:08
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const tenantIndustryApi = {

  /**
   * 分页查询  @author  loki
   */
  queryPage : (param) => {
    return postRequest('/tenant/industry/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
      return postRequest('/tenant/industry/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
      return postRequest('/tenant/industry/update', param);
  },


  /**
   * 删除  @author  loki
   */
  delete: (id) => {
      return getRequest(`/tenant/industry/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
      return postRequest('/tenant/industry/batchDelete', idList);
  },

};
