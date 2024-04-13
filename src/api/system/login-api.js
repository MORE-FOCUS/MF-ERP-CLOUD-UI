/*
 *  登录
 */
import { getRequest, postRequest } from '/src/lib/axios';

export const loginApi = {
  /**
   * 登录 @author loki
   */
  login: (param) => {
    return postRequest('/login', param);
  },

  /**
   * 退出登录 @author loki
   */
  logout: () => {
    return getRequest('/login/logout');
  },

  /**
   * 获取验证码 @author loki
   */
  getCaptcha: () => {
    return getRequest('/login/getCaptcha');
  },

  /**
   * 获取登录信息 @author loki
   */
  getLoginInfo: () => {
    return getRequest('/login/getLoginInfo');
  },
};
