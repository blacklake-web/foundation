import { useState } from 'react';

interface UseVisibleRt {
  /**判断当前key的状态 */
  judgeVisible: (key: string) => boolean;
  /**增加指定状态 */
  addVisible: (key: string) => void;
  /**删除指定状态 */
  deleteVisible: (key: string) => void;
  /**清空所有状态 */
  clearVisible: () => void;
}

/**
 * 多个显示状态的管理,存在的key状态为true,不存在的为false。可以用到（Modal,Drawer,或批量状态的判断）
 * @param visibleList
 */
export const useVisible = (defaultVisibleList?: string[]): UseVisibleRt => {
  const [visibleList, setVisibleList] = useState(defaultVisibleList ?? []);

  /**
   * 判断当前key的状态
   * @param key string
   * @returns boolean
   */
  const judgeVisible = (key: string) => {
    return visibleList.includes(key);
  };

  /**
   * 增加状态
   * @param key
   */
  const addVisible = (key: string) => {
    if (!judgeVisible(key)) {
      setVisibleList((preList) => [...preList, key]);
    }
  };

  /**
   * 删除状态
   * @param key
   */
  const deleteVisible = (key: string) => {
    setVisibleList((preList) => preList.filter((i) => i !== key));
  };

  /**
   * 清空全部
   */
  const clearVisible = () => {
    setVisibleList([]);
  };

  return { judgeVisible, addVisible, deleteVisible, clearVisible };
};
