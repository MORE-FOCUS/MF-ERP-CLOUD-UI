/*
 * reload (内存热加载、钩子等)
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const reloadApi = {
  // 查询reload列表 @author loki
  queryList: () => {
    return getRequest('/support/reload/query');
  },
  // 获取reload result @author loki
  queryReloadResult: (tag) => {
    return getRequest(`/support/reload/result/${tag}`);
  },
  // 执行reload @author loki
  reload: (reloadForm) => {
    return postRequest('/support/reload/update', reloadForm);
  },
};
