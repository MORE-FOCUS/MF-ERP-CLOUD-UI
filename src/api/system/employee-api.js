/*
 *  员工
 */

import { getRequest, postRequest } from '/src/lib/axios';

export const employeeApi = {
  /**
   * 员工管理查询
   */
  queryEmployee: (params) => {
    return postRequest('/employee/queryPage', params);
  },
  /**
   * 查询所有员工 @author loki
   */
  queryAll: (params) => {
    return postRequest('/employee/queryAll',params);
  },
  /**
   * 添加员工
   */
  addEmployee: (params) => {
    return postRequest('/employee/add', params);
  },
  /**
   * 更新员工信息
   */
  updateEmployee: (params) => {
    return postRequest('/employee/update', params);
  },
  /**
   * 删除员工
   */
  deleteEmployee: (employeeId) => {
    return getRequest(`/employee/delete/${employeeId}`);
  },
  /**
   * 批量删除员工
   */
  batchDeleteEmployee: (employeeIdList) => {
    return postRequest('/employee/update/batch/delete', employeeIdList);
  },
  /**
   * 批量调整员工部门
   */
  batchUpdateDepartmentEmployee: (updateParam) => {
    return postRequest('/employee/update/batch/department', updateParam);
  },
  /**
   * 重置员工密码
   */
  resetPassword: (employeeId) => {
    return getRequest(`/employee/update/password/reset/${employeeId}`);
  },
  /**
   * 修改面面
   */
  updateEmployeePassword: (param) => {
    return postRequest('/employee/update/password', param);
  },

  /**
   * 更新员工禁用状态
   */
  updateDisabled: (employeeId) => {
    return getRequest(`/employee/update/disabled/${employeeId}`);
  },

  /**
   * 查询员工-根据部门id
   */
  queryEmployeeByDeptId: (deptId) => {
    return getRequest(`/employee/query/dept/${deptId}`);
  },
};
