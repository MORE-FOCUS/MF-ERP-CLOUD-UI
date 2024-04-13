/**
 * 登录锁定 api 封装
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const loginFailApi = {

  /**
   * 分页查询  @author   loki
   */
  queryPage : (param) => {
    return postRequest('/support/protect/loginFail/queryPage', param);
  },

  /**
   * 批量删除  @author   loki
   */
  batchDelete: (idList) => {
      return postRequest('/support/protect/loginFail/batchDelete', idList);
  },

};
