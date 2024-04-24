/*
 * 登录日志
 */
export const RULE_TYPE_ENUM = {
  NONE: {
    value: 'none',
    desc: '没有周期',
  },
  YEAR: {
    value: 'year',
    desc: '年周期',
  },
  MONTH: {
    value: 'month',
    desc: '月周期',
  },
  DAY: {
    value: 'day',
    desc: '日周期',
  },
};

export default {
  RULE_TYPE_ENUM,
};
