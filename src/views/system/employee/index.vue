<!--
  * 组织架构
-->
<template>
  <div class="height100">
    <a-row :gutter="24" class="height100">
      <a-col :span="5">
        <DepartmentTree ref="departmentTree" />
      </a-col>

      <a-col :span="19" class="height100">
        <div class="employee-box height100">
          <EmployeeList class="employee" :deptId="selectedDeptId" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup>
import _ from 'lodash';
import { computed, ref } from 'vue';
import DepartmentTree from '/@/components/system/department-tree/department-tree.vue';
import EmployeeList from './components/employee-list/index.vue';

const departmentTree = ref();

// 当前选中的部门id
const selectedDeptId = computed(() => {
  if (departmentTree.value) {
    let selectedKeys = departmentTree.value.selectedKeys;
    return _.isEmpty(selectedKeys) ? null : selectedKeys[0];
  }
  return null;
});
</script>
<style scoped lang="less">
.height100 {
  height: 100%;
}

.employee-box {
  display: flex;
  flex-direction: column;

  .employee {
    flex-grow: 2;
  }
}
</style>
