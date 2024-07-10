/**
 * 供应商 api 封装
 *
 * @author:    loki
 * @date:      2024-04-09 00:04:56
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const supplierApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/supplier/queryPage', param);
  },
  /**
   * 查询所有  @author  loki
   */
  queryAll: (param) => {
    return postRequest('/supplier/queryAll', param);
  },
  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/supplier/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/supplier/update', param);
  },

  /**
   * 删除  @author  loki
   */
  delete: (id) => {
    return getRequest(`/supplier/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
    return postRequest('/supplier/batchDelete', idList);
  },
};
