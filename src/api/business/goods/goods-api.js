import {postRequest, getRequest, getDownload} from '/@/lib/axios';

export const goodsApi = {
  // 添加商品 @author loki
  addGoods: (param) => {
    return postRequest('/goods/add', param);
  },
  // 删除 @author loki
  deleteGoods: (goodsId) => {
    return getRequest(`/goods/delete/${goodsId}`);
  },
  // 批量 @author loki
  batchDelete: (goodsIdList) => {
    return postRequest('/goods/batchDelete', goodsIdList);
  },
  // 分页查询 @author loki
  queryGoodsList: (param) => {
    return postRequest('/goods/query', param);
  },
  // 更新商品 @author loki
  updateGoods: (param) => {
    return postRequest('/goods/update', param);
  },

  // 导入 @author loki
  importGoods : (file) =>{
    return postRequest('/goods/importGoods',file);
  },

  // 导出 @author loki
  exportGoods : () =>{
    return getDownload('/goods/exportGoods');
  }
};
