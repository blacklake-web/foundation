import _ from 'lodash';

/**
 * 过滤当前列表权限
 * @param list
 * @param userAuth
 * @returns
 */
export const filterListAuth = <T extends { auth?: string }>(list: T[], userAuth: string[]) => {
  return _.filter(list, ({ auth }) => !auth || userAuth.includes(auth));
};

/**
 * 隐藏非受控的Popover
 */
export const hidePopover = () => document.dispatchEvent(new MouseEvent('mousedown'));
