export default {
  entry: 'src/index.ts',
  cjs: 'rollup',
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
