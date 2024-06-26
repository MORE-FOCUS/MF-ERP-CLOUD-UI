/*
 * 银行卡
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const bankApi = {
  // 新建银行信息 @author loki
  create: (param) => {
    return postRequest('/oa/bank/create', param);
  },

  // 删除银行信息 @author loki
  delete: (bankId) => {
    return getRequest(`/oa/bank/delete/${bankId}`);
  },

  // 查询银行信息详情 @author loki
  detail: (bankId) => {
    return getRequest(`/oa/bank/get/${bankId}`);
  },

  // 分页查询银行信息 @author loki
  pageQuery: (param) => {
    return postRequest('/oa/bank/page/query', param);
  },

  // 编辑银行信息 @author loki
  update: (param) => {
    return postRequest('/oa/bank/update', param);
  },

  // 根据企业ID查询不分页的银行列表 @author loki
  queryList: (enterpriseId) => {
    return getRequest(`/oa/bank/query/list/${enterpriseId}`);
  },
};
