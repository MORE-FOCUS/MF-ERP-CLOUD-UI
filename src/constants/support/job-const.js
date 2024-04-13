/**
 * 定时任务调度表 枚举
 *
 * @author:    loki
 * @date:      2024-01-21 16:37:55
 */
// 任务组
export const JOB_GROUP_ENUM = {
  ALLOW: {
    value: 'temp',
    desc: '临时任务',
  },
  FORBID: {
    value: 'system',
    desc: '系统任务',
  },
};

// 计划执行错误策略
export const MISFIRE_POLICY_ENUM = {
  IMMEDIATELY: {
    value: 1,
    desc: '立即执行',
  },
  ONECE: {
    value: 2,
    desc: '执行一次',
  },
  STOP: {
    value: 3,
    desc: '放弃',
  },
};

export default {
  JOB_GROUP_ENUM,
  MISFIRE_POLICY_ENUM,
};
