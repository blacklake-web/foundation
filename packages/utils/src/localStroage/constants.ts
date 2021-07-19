/**
 * 缓存限制
 */
export enum StorageLimitType {
  USER = '1', // 单用户缓存 根据用户ID缓存不同key
  ORG = '2', // 不同工厂对相同的key会存储/读取不同的值
}

export const STORAGE_EXPIRED = 'expired';
