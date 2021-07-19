import _ from 'lodash';

import { StorageLimitType, STORAGE_EXPIRED } from './constants';
import { BlStroageInfo } from './index.type';

/**
 * 限制用户缓存隔离时，必须传userId,限制组织缓存隔离时，必须传orgId
 * 登录时记得初始化，登出时清空
 */
class BlLocalStorage {
  orgId?: number;
  userId?: number;

  constructor() {}

  /**
   * 设置当前登录userId,orgId,如果不需要限制，可以不传，登录时初始化
   * @param userId
   * @param orgId
   */
  public setBaseInfo = (userId?: number, orgId?: number) => {
    this.userId = userId;
    this.orgId = orgId;
  };

  /**
   * 清除信息
   */
  public clearBaseInfo = () => {
    this.userId = undefined;
    this.orgId = undefined;
  };

  getLimitKey = (limitType: StorageLimitType) => {
    if (limitType === StorageLimitType.USER && this.userId) {
      return `userId-${this.userId}`;
    }
    if (limitType === StorageLimitType.ORG && this.orgId) {
      return `orgId-${this.orgId}`;
    }

    return '';
  };

  /**
   *
   * @param key
   * @returns 过期统一返回StorageExpired
   */
  public get(key: string): BlStroageInfo['data'] {
    const localData = localStorage.getItem(key);

    if (localData) {
      const value: BlStroageInfo = JSON.parse(localData);

      const now = new Date().getTime();
      const { time: storageTime, expiration, limitType } = value.meta;

      // 是否符合读取限制条件
      const isTimeIncompatible = expiration !== 0 && now - storageTime > expiration;

      // 如果存在限制条件
      if (limitType) {
        const strorageCurrentTime = _.get(value, `data[${this.getLimitKey(limitType)}].time`); // 当前对象操作时间

        const isCurrentTimeIncompatible =
          expiration !== 0 && now - strorageCurrentTime > expiration;

        // 如果过期 删除对应值
        if (isCurrentTimeIncompatible) {
          this.remove(key);
          return STORAGE_EXPIRED;
        }

        return _.get(value, `data[${this.getLimitKey(limitType)}].data`);
      } else if (isTimeIncompatible) {
        this.remove(key);
        return STORAGE_EXPIRED;
      }

      return value.data;
    }
    return undefined;
  }

  /**
   *
   * @param key
   * @param data
   * @param limitOption.limitType 为存储类型限制，类型为枚举值，具体描述参照定义。
   * @param limitOption.expiration 不传为默认无限期：0，使用时传到秒就行
   * @returns
   */
  public set(
    key: string,
    data: any,
    option?: {
      expiration?: number;
      limitType?: StorageLimitType;
    },
  ): void {
    const { expiration = 0, limitType } = option || {};
    const currentTime = new Date().getTime();

    const newValue: BlStroageInfo = {
      meta: {
        expiration: expiration * 1000,
        time: currentTime,
        limitType,
      },
      data,
    };

    if (limitType === StorageLimitType.USER) {
      if (!this.userId) {
        console.error('设置用户限制类型的LocalStorage必须有用户信息');
        return;
      }
      newValue.data = {
        ...this.getStorageData(key),
        [this.getLimitKey(limitType)]: { tiem: currentTime, data },
      };
    } else if (limitType === StorageLimitType.ORG) {
      if (!this.orgId) {
        console.error('设置工厂限制类型的LocalStorage必须有工厂信息');
        return;
      }
      newValue.data = {
        ...this.getStorageData(key),
        [this.getLimitKey(limitType)]: { tiem: currentTime, data },
      };
    }

    localStorage.setItem(key, JSON.stringify(newValue));
  }

  /**
   * 移除指定key
   * @param key
   */
  public remove(key: string): void {
    const meta = this.getStorageMeta(key);

    if (meta) {
      const { limitType, expiration } = meta;

      if (limitType) {
        this.set(key, undefined, { expiration, limitType });
      } else {
        localStorage.removeItem(key);
      }
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * 清空localStroage
   */
  public clear(): void {
    localStorage.clear();
  }

  /**
   * 获取存储信息meta
   * @param key
   * @returns
   */
  private getStorageMeta(key: string): BlStroageInfo['meta'] | undefined {
    const storageJsonData = localStorage.getItem(key);

    if (storageJsonData) {
      const value: BlStroageInfo = JSON.parse(storageJsonData);

      return value.meta;
    }
    return undefined;
  }

  /**
   * 获取原始用于新增或修改
   * @param key
   * @returns
   */
  private getStorageData(key: string): BlStroageInfo['data'] {
    const storageJsonData = localStorage.getItem(key);

    if (storageJsonData) {
      const value: BlStroageInfo = JSON.parse(storageJsonData);

      return value.data;
    }
    return undefined;
  }
}

export { BlLocalStorage, StorageLimitType, STORAGE_EXPIRED };
