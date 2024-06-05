import { postRequest, getRequest, getDownload } from '/@/lib/axios';

export const spuApi = {
  //查询商品详情
  queryDetail: (id) => {
    return getRequest(`/spu/queryDetail/${id}`);
  },

  // 添加商品基本信息
  addSpuBase: (param) => {
    return postRequest('/spu/base/add', param);
  },
  // 更新商品基本信息
  updateSpuBase: (param) => {
    return postRequest('/spu/base/update', param);
  },

  // 更新商品单位
  updateSpuUnit: (param) => {
    return postRequest('/spu/unit/update', param);
  },

  //更新商品图片
  updateSpuImages: (param) => {
    return postRequest('/spu/images/update', param);
  },

  //更新商品属性
  updateSpuSpecial: (param) => {
    return postRequest('/spu/special/update', param);
  },

  //更新商品条形码
  updateSpuBarcode: (param) => {
    return postRequest('/spu/barcode/update', param);
  },

  // 删除
  deleteSpu: (id) => {
    return getRequest(`/spu/delete/${id}`);
  },
  // 批量
  batchDelete: (idList) => {
    return postRequest('/spu/batchDelete', idList);
  },
  // 分页查询
  querySpuList: (param) => {
    return postRequest('/spu/queryPage', param);
  },

  // 导入
  importSpu: (file) => {
    return postRequest('/spu/importSpu', file);
  },

  // 导出
  exportSpu: () => {
    return getDownload('/spu/exportSpu');
  },

  //查询商品基本信息
  querySpuBase: (param) => {
    return getRequest('/spu/base/' + param);
  },
};
