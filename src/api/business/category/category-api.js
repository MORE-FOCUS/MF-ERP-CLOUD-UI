/*
 * 类目api
 */
import { getRequest, postRequest } from '/@/lib/axios';

export const categoryApi = {
  // 添加类目
  add: (param) => {
    return postRequest('/category/add', param);
  },

  // 删除类目
  delete: (categoryId) => {
    return getRequest(`/category/delete/${categoryId}`);
  },

  // 查询类目层级树
  queryTree: (param) => {
    return postRequest('/category/tree', param);
  },
  // 更新类目
  update: (param) => {
    return postRequest('/category/update', param);
  },
};
