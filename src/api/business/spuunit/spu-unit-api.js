/**
 * SPU单位 api 封装
 *
 * @author:    loki
 * @date:      2024-04-16 23:57:58
 */
import { postRequest, getRequest } from '/@/lib/axios';

export const spuUnitApi = {
  /**
   * 分页查询  @author  loki
   */
  queryPage: (param) => {
    return postRequest('/spu-unit/queryPage', param);
  },

  /**
   * 查询所有  @author  loki
   */
  queryAll: (param) => {
    return postRequest('/spu-unit/queryAll', param);
  },

  /**
   * 增加  @author  loki
   */
  add: (param) => {
    return postRequest('/spu-unit/add', param);
  },

  /**
   * 修改  @author  loki
   */
  update: (param) => {
    return postRequest('/spu-unit/update', param);
  },

  /**
   * 更新禁用状态
   */
  updateDisabled: (id) => {
    return postRequest(`/spu-unit/disabled/${id}`);
  },
};
