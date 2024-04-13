/*
 * 心跳
 */
import { postRequest } from '/src/lib/axios';

export const heartBeatApi = {
  // 分页查询 @author loki
  queryList: (param) => {
    return postRequest('/support/heartBeat/query', param);
  },
};
