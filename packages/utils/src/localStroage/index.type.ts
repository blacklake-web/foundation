import { StorageLimitType } from './constants';

export interface BlStroageInfo {
  meta: {
    expiration: number; // 有效期时长 0：无限 毫秒为单位，出入时只用传到秒就好
    time: number; // 缓存时间
    limitType?: StorageLimitType; // 限制类型
  };
  data?: any | { time: number; data: any }[];
}
