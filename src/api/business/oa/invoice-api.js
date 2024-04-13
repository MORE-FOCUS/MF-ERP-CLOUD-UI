/* 
  * OA发票信息
  */
import { postRequest, getRequest } from '/@/lib/axios';

export const invoiceApi = {

  // 新建发票信息 @author loki
  create: (param) => {
    return postRequest('/oa/invoice/create', param);
  },

  // 删除发票信息 @author loki
  delete: (bankId) => {
    return getRequest(`/oa/invoice/delete/${bankId}`);
  },

  // 查询发票信息详情 @author loki
  detail: (bankId) => {
    return getRequest(`//oa/invoice/get/${bankId}`);
  },

  // 分页查询发票信息 @author loki
  pageQuery: (param) => {
    return postRequest('/oa/invoice/page/query', param);
  },

  // 编辑发票信息 @author loki
  update: (param) => {
    return postRequest('/oa/invoice/update', param);
  },

  // 查询发票列表 @author loki
  queryList: (enterpriseId) => {
    return getRequest(`/oa/invoice/query/list/${enterpriseId}`);
  },

};
