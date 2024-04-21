/*
 * 类目api
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const categoryApi = {
  // 查询类目层级树
  queryTree: (param) => {
    return postRequest('/category/tree', param);
  },

  // 查询类目列表
  queryAll: (param) => {
    return postRequest('/category/queryAll', param);
  },

  // 添加类目
  add: (param) => {
    return postRequest('/category/add', param);
  },

  // 删除类目
  delete: (categoryId) => {
    return getRequest(`/category/delete/${categoryId}`);
  },

  // 更新类目
  update: (param) => {
    return postRequest('/category/update', param);
  },
};
