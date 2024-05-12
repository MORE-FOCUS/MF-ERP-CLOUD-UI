import {postRequest, getRequest, getDownload} from '/@/lib/axios';

export const spuApi = {
  // 添加商品 @author loki
  addSpu: (param) => {
    return postRequest('/spu/add', param);
  },
  // 删除 @author loki
  deleteSpu: (id) => {
    return getRequest(`/spu/delete/${d}`);
  },
  // 批量 @author loki
  batchDelete: (idList) => {
    return postRequest('/spu/batchDelete', idList);
  },
  // 分页查询 @author loki
  querySpuList: (param) => {
    return postRequest('/spu/query', param);
  },
  // 更新商品 @author loki
  updateSpu: (param) => {
    return postRequest('/spu/update', param);
  },

  // 导入 @author loki
  importSpu : (file) =>{
    return postRequest('/spu/importSpu',file);
  },

  // 导出 @author loki
  exportSpu : () =>{
    return getDownload('/spu/exportSpu');
  }
};
