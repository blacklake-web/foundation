// eslint-disable-next-line no-shadow
export enum TerminalEnum {
  /**
   * 移动端
   */
  APP = 1,
  /**
   * 网页端+移动端
   */
  APP_AND_WEB,
  /**
   * 电视端
   */
  TV,
}

export const TerminalList = {
  [TerminalEnum.APP]: '移动端',
  [TerminalEnum.APP_AND_WEB]: '网页端+移动端',
  [TerminalEnum.TV]: '电视端',
};
