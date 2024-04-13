/**
 * 系统更新日志 api 封装
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const changeLogApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/support/changeLog/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/support/changeLog/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/support/changeLog/update', param);
  },

  /**
   * 删除  @author  loki
   */
  delete: (id) => {
    return getRequest(`/support/changeLog/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
    return postRequest('/support/changeLog/batchDelete', idList);
  },
};
