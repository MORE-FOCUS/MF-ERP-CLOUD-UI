/**
 * 定时任务调度表 api 封装
 *
 * @author:    loki
 * @date:      2024-01-21 16:37:55
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const jobApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/job/queryPage', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/job/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/job/update', param);
  },

  /**
   * 删除  @author  loki
   */
  delete: (id) => {
    return getRequest(`/job/delete/${id}`);
  },

  /**
   * 批量删除  @author  loki
   */
  batchDelete: (idList) => {
    return postRequest('/job/batchDelete', idList);
  },

  /**
   * 执行一次
   */
  run: (idList) => {
    return postRequest('/job/run',idList)
  },
};
