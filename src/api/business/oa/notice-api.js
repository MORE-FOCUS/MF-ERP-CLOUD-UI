/*
 * 公告信息、企业动态
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const noticeApi = {
  // ---------------- 通知公告类型 -----------------------

  // 通知公告类型-获取全部 @author loki
  getAllNoticeTypeList() {
    return getRequest('/oa/noticeType/getAll');
  },

  // 通知公告类型-添加 @author loki
  addNoticeType(name) {
    return getRequest(`/oa/noticeType/add/${name}`);
  },

  // 通知公告类型-修改 @author loki
  updateNoticeType(noticeTypeId, name) {
    return getRequest(`/oa/noticeType/update/${noticeTypeId}/${name}`);
  },
  // 通知公告类型-删除 @author loki
  deleteNoticeType(noticeTypeId) {
    return getRequest(`/oa/noticeType/delete/${noticeTypeId}`);
  },

  // ---------------- 通知公告管理 -----------------------

  // 通知公告-分页查询 @author loki
  queryNotice(param) {
    return postRequest('/oa/notice/query', param);
  },

  // 通知公告-添加 @author loki
  addNotice(param) {
    return postRequest('/oa/notice/add', param);
  },

  // 通知公告-更新 @author loki
  updateNotice(param) {
    return postRequest('/oa/notice/update', param);
  },

  // 通知公告-删除 @author loki
  deleteNotice(noticeId) {
    return getRequest(`/oa/notice/delete/${noticeId}`);
  },

  // 通知公告-更新详情 @author loki
  getUpdateNoticeInfo(noticeId) {
    return getRequest(`/oa/notice/getUpdateVO/${noticeId}`);
  },

  // --------------------- 【员工】查看 通知公告 -------------------------

  // 通知公告-员工-查看详情 @author loki
  view(noticeId) {
    return getRequest(`/oa/notice/employee/view/${noticeId}`);
  },

  // 通知公告-员工-查询 @author loki
  queryEmployeeNotice(param) {
    return postRequest('/oa/notice/employee/query', param);
  },

  // 【员工】通知公告-查询 查看记录 @author loki
  queryViewRecord(param) {
    return postRequest('/oa/notice/employee/queryViewRecord', param);
  },
};
