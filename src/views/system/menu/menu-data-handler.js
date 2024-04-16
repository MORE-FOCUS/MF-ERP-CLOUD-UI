/*
 * 此文件是处理 菜单数据的类，主要用于：
 * 1、菜单树形表格的构造
 * 2、菜单的前端过滤
 */

import _ from 'lodash';
/**
 * 过滤菜单
 * @param {*} menuList
 * @param {*} queryForm
 * @returns
 */
export const filterMenuByQueryForm = (menuList, queryForm) => {
  if (!menuList || menuList.length === 0) {
    return [];
  }

  let filterResult = [];
  for (const menu of menuList) {
    if (isMenuExistKeywords(menu, queryForm.keywords) && isMenuExistMenuType(menu, queryForm.menuType) && isMenuExistMenuFlag(menu, queryForm)) {
      filterResult.push(menu);
    }
  }
  return filterResult;
};

/**
 * 构建菜单表格树形数据
 */
export const buildMenuTableTree = (menuList) => {
  let topMenuList = [];
  const menuIdSet = new Set();
  for (const menu of menuList) {
    menuIdSet.add(menu.menuId);
  }

  for (const menu of menuList) {
    const pid = menu.pid;
    // 不存在父节点，则为顶级菜单
    if (!menuIdSet.has(pid)) {
      topMenuList.push(menu);
    }
  }

  recursiveMenuTree(menuList, topMenuList);
  return topMenuList;
};

/**
 * 递归遍历菜单树形数据
 * @param {*} menuList
 * @param {*} parentArray
 */
function recursiveMenuTree(menuList, parentArray) {
  for (const parent of parentArray) {
    const children = menuList.filter((e) => e.pid === parent.menuId);
    if (children.length > 0) {
      parent.children = children;
      recursiveMenuTree(menuList, parent.children);
    }
  }
}

/**
 * 过滤菜单状态
 * @param {*} menu
 * @param {*} queryForm
 * @returns
 */
function isMenuExistMenuFlag(menu, queryForm) {
  let isFrameCondition = false;
  if (!_.isNil(queryForm.isFrame)) {
    isFrameCondition = !_.isNil(menu.isFrame) && menu.isFrame === (queryForm.isFrame === 1);
  } else {
    isFrameCondition = true;
  }

  let isCachedCondition = false;
  if (!_.isNil(queryForm.isCached)) {
    isCachedCondition = !_.isNil(menu.isCached) && menu.isCached === (queryForm.isCached === 1);
  } else {
    isCachedCondition = true;
  }

  let isVisibleCondition = false;
  if (!_.isNil(queryForm.isVisible)) {
    isVisibleCondition = !_.isNil(menu.isVisible) && menu.isVisible === (queryForm.isVisible === 1);
  } else {
    isVisibleCondition = true;
  }

  let isDisabledCondition = false;
  if (!_.isNil(queryForm.isDisabled)) {
    isDisabledCondition = !_.isNil(menu.isDisabled) && menu.isDisabled === (queryForm.isDisabled === 1);
  } else {
    isDisabledCondition = true;
  }

  return isFrameCondition && isCachedCondition && isVisibleCondition && isDisabledCondition;
}

/**
 * 过滤菜单类型
 * @param {*} menu
 * @param {*} menuType
 * @returns
 */
function isMenuExistMenuType(menu, menuType) {
  if (!menuType) {
    return true;
  }

  if (menu.menuType && menu.menuType === menuType) {
    return true;
  }
  return false;
}

/**
 * 过滤关键字
 */
function isMenuExistKeywords(menu, keywords) {
  if (!keywords) {
    return true;
  }

  if (menu.component && menu.component.indexOf(keywords) > -1) {
    return true;
  }

  if (menu.menuName && menu.menuName.indexOf(keywords) > -1) {
    return true;
  }
  if (menu.path && menu.path.indexOf(keywords) > -1) {
    return true;
  }
  if (menu.apiPerms && menu.apiPerms.indexOf(keywords) > -1) {
    return true;
  }
  if (menu.webPerms && menu.webPerms.indexOf(keywords) > -1) {
    return true;
  }
  return false;
}
