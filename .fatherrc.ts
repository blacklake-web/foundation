export default {
  esm: 'rollup',
  extractCSS: true,
  pkgs: ['utils', 'component', 'layout'],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
