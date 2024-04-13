/*
 * 字典
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const dictApi = {
  // 分页查询数据字典KEY - @author loki
  keyQuery: (param) => {
    return postRequest('/support/dict/key/query', param);
  },
  // 查询全部字典key - @author loki
  queryAllKey: () => {
    return getRequest('/support/dict/key/queryAll');
  },
  /**
   * 分页查询数据字典value - @author loki  
   */ 
  valueQuery: (param) => {
    return postRequest('/support/dict/value/query', param);
  },
  // 数据字典KEY-添加- @author loki
  keyAdd: (param) => {
    return postRequest('/support/dict/key/add', param);
  },
  // 分页查询数据字典value - @author loki
  valueAdd: (param) => {
    return postRequest('/support/dict/value/add', param);
  },
  // 数据字典key-更新- @author loki
  keyEdit: (param) => {
    return postRequest('/support/dict/key/edit', param);
  },
  // 数据字典Value-更新- @author loki
  valueEdit: (param) => {
    return postRequest('/support/dict/value/edit', param);
  },
  // 数据字典key-删除- @author loki
  keyDelete: (keyIdList) => {
    return postRequest('/support/dict/key/delete', keyIdList);
  },
  // 数据字典Value-删除- @author loki
  valueDelete: (valueIdList) => {
    return postRequest('/support/dict/value/delete', valueIdList);
  },
  // 缓存刷新- @author loki
  cacheRefresh: () => {
    return getRequest('/support/dict/cache/refresh');
  },
  // 数据字典-值列表- @author loki
  valueList: (keyCode) => {
    return getRequest(`/support/dict/value/list/${keyCode}`);
  },
};
