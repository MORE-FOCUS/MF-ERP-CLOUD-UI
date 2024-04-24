/*
 * 单据序列号
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const serialNumberApi = {
  // 生成单号
  generate: (generateForm) => {
    return postRequest('/support/serial-number/generate', generateForm);
  },
  // 获取所有单号定义
  getAll: () => {
    return getRequest('/support/serial-number/all');
  },
  // 获取生成记录
  queryRecord: (form) => {
    return postRequest('/support/serial-number/queryRecord', form);
  },
  //编辑
  update:(form) => {
    return postRequest('/support/serial-number/update', form);
  },
  //删除
  delete:(id) => {
    return postRequest(`/support/serial-number/delete/${id}`);
  },
};
