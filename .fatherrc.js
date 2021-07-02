export default {
  entry: 'src/index.ts',
  esm: 'rollup',
  cjs: 'babel',
  target: 'browser',
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
