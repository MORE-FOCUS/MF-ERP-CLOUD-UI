import { postRequest, getRequest, getDownload } from '/@/lib/axios';

export const spuApi = {
  //查询商品详情
  queryDetail: (id) => {
    return getRequest(`/spu/queryDetail/${id}`);
  },
  // 添加商品 @author loki
  addSpuBase: (param) => {
    return postRequest('/spu/base/add', param);
  },
  // 更新商品 @author loki
  updateSpuBase: (param) => {
    return postRequest('/spu/base/update', param);
  },

  // 删除 @author loki
  deleteSpu: (id) => {
    return getRequest(`/spu/delete/${id}`);
  },
  // 批量 @author loki
  batchDelete: (idList) => {
    return postRequest('/spu/batchDelete', idList);
  },
  // 分页查询 @author loki
  querySpuList: (param) => {
    return postRequest('/spu/queryPage', param);
  },

  // 导入 @author loki
  importSpu: (file) => {
    return postRequest('/spu/importSpu', file);
  },

  // 导出 @author loki
  exportSpu: () => {
    return getDownload('/spu/exportSpu');
  },

  //查询商品基本信息
  querySpuBase: (param) => {
    return getRequest('/spu/base/' + param);
  },
};
