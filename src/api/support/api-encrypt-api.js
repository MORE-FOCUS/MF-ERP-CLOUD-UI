/**
 * 接口：加密、解密
 */
import { postRequest, postEncryptRequest } from '/src/lib/axios';

export const encryptApi = {

  /**
   * 测试 请求加密  @author   loki
   */
  testRequestEncrypt: (param) => {
    return postEncryptRequest('/support/apiEncrypt/testRequestEncrypt', param);
  },

  /**
   * 测试 返回加密  @author   loki
   */
  testResponseEncrypt: (param) => {
    return postRequest('/support/apiEncrypt/testResponseEncrypt', param);
  },

  /**
   * 测试 请求参数加密和解密、返回数据加密和解密  @author   loki
   */
  testDecryptAndEncrypt: (param) => {
    return postEncryptRequest('/support/apiEncrypt/testDecryptAndEncrypt', param);
  },

  /**
   * 测试 数组加解密  @author   loki
   */
  testArray : (param) => {
    return postEncryptRequest('/support/apiEncrypt/testArray', param);
  },
  
};
