/*
 * 帮助文档
 */
import { postRequest, getRequest } from '/src/lib/axios';

export const helpDocApi = {
  // 【管理】帮助文档-分页查询 @author loki
  query: (param) => {
    return postRequest('/support/helpDoc/query', param);
  },

  //【管理】帮助文档-更新 @author loki
  update: (param) => {
    return postRequest('/support/helpDoc/update', param);
  },

  // 【管理】帮助文档-添加 @author loki
  add: (param) => {
    return postRequest('/support/helpDoc/add', param);
  },

  //【管理】帮助文档-删除 @author loki
  delete: (helpDocId) => {
    return getRequest(`/support/helpDoc/delete/${helpDocId}`);
  },

  //【管理】帮助文档-获取详情 @author loki
  getDetail: (helpDocId) => {
    return getRequest(`/support/helpDoc/getDetail/${helpDocId}`);
  },

  //【管理】帮助文档-根据关联id查询 @author loki
  queryHelpDocByRelationId: (relationId) => {
    return getRequest(`/support/helpDoc/queryHelpDocByRelationId/${relationId}`);
  },

  //----------------------- 用户相关 --------------------------------

  //【用户】帮助文档-查询全部 @author loki
  getAllHelpDocList() {
    return getRequest('/support/helpDoc/user/queryAllHelpDocList');
  },

  //【用户】帮助文档-查询全部 @author loki
  view(helpDocId) {
    return getRequest(`/support/helpDoc/user/view/${helpDocId}`);
  },

  //【用户】帮助文档-查询 查看记录 @author loki
  queryViewRecord(param) {
    return postRequest('/support/helpDoc/user/queryViewRecord', param);
  },
};
