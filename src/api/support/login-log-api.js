/*
 * 登录日志
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const loginLogApi = {
  // 分页查询 @author loki
  queryList: (param) => {
    return postRequest('/support/loginLog/page/query', param);
  },
};
