/*
 * 数据变动
 */
import { postRequest } from '/src/lib/axios';

export const dataTracerApi = {
  // 分页查询业务操作日志 - @author loki
  queryList: (param) => {
    return postRequest('/support/dataTracer/query', param);
  },
  
};
