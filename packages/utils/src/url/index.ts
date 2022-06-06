import Url from 'url-parse';
import queryString from 'query-string';

interface LocationOptions {
  type?: string;
}

interface Param {
  [index: string]: any;
}

/**
 * getParams 获取url中的参数
 */
function getParams() {
  const { query: formatParams } = queryString.parseUrl(location.search, {
    arrayFormat: 'bracket-separator',
    arrayFormatSeparator: '|',
    parseNumbers: true,
  });

  return formatParams;
}

/**
 * 设置 url params
 */
function setParams(params: Param) {
  const { pathname } = location;

  const newUrl = queryString.stringifyUrl(
    {
      url: pathname,
      query: params,
    },
    {
      arrayFormat: 'bracket-separator',
      arrayFormatSeparator: '|',
      skipNull: true,
    },
  );

  window.history.replaceState(null, '', newUrl);
  return newUrl;
}

/** to make relative path and absolute path both work
 * @description 登录跳转时使用
 * @param path
 * @returns {string}
 */
export const getRelativePath = (path: string): string => {
  if (!path) {
    return '/';
  }
  const url = new Url(decodeURIComponent(path));

  return `${url.pathname}${url.query}`;
};

/**
 * @description 获取路由中的参数
 * @param props
 * @returns
 */
const getRouteParams = (props: any) => props.match.params;

interface FuncProps {
  getParams: () => Param;
  setParams: (params: Param) => void;
  getRelativePath: (path: string) => string;
  getRouteParams: (props: any) => any;
}

const BlUrl = {} as FuncProps;

BlUrl.getParams = getParams;
BlUrl.setParams = setParams;
BlUrl.getRelativePath = getRelativePath;
BlUrl.getRouteParams = getRouteParams;

export { BlUrl };
