/*
 * 操作日志
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const operateLogApi = {
  // 分页查询 @author loki
  queryList: (param) => {
    return postRequest('/support/operateLog/page/query', param);
  },
  // 详情 @author loki
  detail: (id) => {
    return getRequest(`/support/operateLog/detail/${id}`);
  },
};
