/**
 * 门店 api 封装
 *
 * @author:    loki
 * @date:      2024-06-23 23:29:01
 */
import { postRequest } from '/@/lib/axios';

export const storeApi = {
  /**
   * 分页查询
   */
  queryPage: (param) => {
    return postRequest('/store/queryPage', param);
  },

  /**
   * 查询所有
   */
  queryAll: (param) => {
    return postRequest('/store/queryAll', param);
  },
};
