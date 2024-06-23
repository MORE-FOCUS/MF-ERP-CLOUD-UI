/**
 * 门店 api 封装
 *
 * @author:    loki
 * @date:      2024-06-23 23:29:01
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const storeApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/store/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/store/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/store/update', param);
  },

  /**
   * 删除  @author  loki
   */
  delete: (id) => {
    return getRequest(`/store/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
    return postRequest('/store/batchDelete', idList);
  },
};
