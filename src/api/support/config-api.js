/*
 * 配置
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const configApi = {
  // 分页查询 @author loki
  queryList: (param) => {
    return postRequest('/support/config/query', param);
  },
  // 添加配置参数 @author loki
  addConfig: (param) => {
    return postRequest('/support/config/add', param);
  },
  // 修改配置参数 @author loki
  updateConfig: (param) => {
    return postRequest('/support/config/update', param);
  },
  // 查询配置详情 @author loki
  queryByKey: (param) => {
    return getRequest(`/support/config/queryByKey?configKey=${param}`);
  },
};
