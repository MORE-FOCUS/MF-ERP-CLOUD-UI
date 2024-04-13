/*
 * 文件上传
 */
import { postRequest, getRequest, getDownload } from '/src/lib/axios';

export const fileApi = {
  // 文件上传 @author loki
  uploadUrl: '/support/file/upload',
  uploadFile: (param, folder) => {
    return postRequest(`/support/file/upload?folder=${folder}`, param);
  },

  /**
   * 分页查询  @author loki
   */
  queryPage: (param) => {
    return postRequest('/support/file/queryPage', param);
  },
  /**
   * 获取文件URL：根据fileKey @author 胡克
   */
  getUrl: (fileKey) => {
    return getRequest(`/support/file/getFileUrl?fileKey=${fileKey}`);
  },

  /**
   * 下载文件流（根据fileKey） @author 胡克
   */
  downLoadFile: (fileName, fileKey) => {
    return getDownload('/support/file/downLoad', { fileKey });
  },
};
