/*
 * 所有常量入口
 */
import menu from './system/menu-const';
import spu from './business/spu/spu-const';
import category from './business/category/category-const';
import { LOGIN_DEVICE_ENUM } from './system/login-device-const';
import { FLAG_NUMBER_ENUM, GENDER_ENUM, USER_TYPE_ENUM, DISABLED_ENUM } from './common-const';
import { LAYOUT_ENUM } from './layout-const';
import file from './support/file-const';
import notice from './business/oa/notice-const';
import loginLog from './support/login-log-const';
import enterprise from './business/oa/enterprise-const';
import codeGeneratorConst from './support/code-generator-const';
import changeLogConst from './support/change-log-const';
import jobConst from './support/job-const';
import tenant from './business/tenant/tenant-const';
import serialNumberConst from './support/serial-number-const';

export default {
  DISABLED_ENUM,
  FLAG_NUMBER_ENUM,
  LOGIN_DEVICE_ENUM,
  GENDER_ENUM,
  USER_TYPE_ENUM,
  LAYOUT_ENUM,
  ...loginLog,
  ...menu,
  ...spu,
  ...category,
  ...file,
  ...notice,
  ...enterprise,
  ...codeGeneratorConst,
  ...changeLogConst,
  ...jobConst,
  ...tenant,
  ...serialNumberConst,
};
