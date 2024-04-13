/*
 * 代码生成器
 */
import { getRequest, postRequest,getDownload } from '/src/lib/axios';

export const codeGeneratorApi = {
  // 查询数据库的表 @author loki
  queryTableList: (param) => {
    return postRequest('/support/codeGenerator/table/queryTableList', param);
  },

  // 查询表的列 @author loki
  getTableColumns: (table) => {
    return getRequest(`/support/codeGenerator/table/getTableColumns/${table}`);
  },

  // ------------------- 配置 -------------------

  // 获取表的配置信息 @author loki
  getConfig: (table) => {
    return getRequest(`/support/codeGenerator/table/getConfig/${table}`);
  },

  // 更新配置信息 @author loki
  updateConfig: (param) => {
    return postRequest('/support/codeGenerator/table/updateConfig', param);
  },

  // ------------------- 生成 -------------------

  // 预览代码 @author loki
  preview: (param) => {
    return postRequest('/support/codeGenerator/code/preview', param);
  },

  // 下载代码 @author loki
  downloadCode: (tableName) => {
    return getDownload(`/support/codeGenerator/code/download/${tableName}`);
  },
};
