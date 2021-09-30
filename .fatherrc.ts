import commonjs from 'rollup-plugin-commonjs';

export default {
  esm: 'rollup',
  extractCSS: true,
  pkgs: ['utils', 'hooks', 'component', 'layout'],
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
  extraRollupPlugins: [
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      include: 'node_modules/**', // Default: undefined

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: ['.js'], // Default: [ '.js' ]

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false, // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType'],
      },
      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      ignore: ['conditional-runtime-dependency'],
    }),
  ],
  lessInRollupMode: {
    modifyVars: {
      '@primary-color': '#02B980', // 全局主色
      '@link-color': '#02B980', // 链接色
      '@success-color': '#52c41a', // 成功色
      '@warning-color': '#faad14', // 警告色
      '@error-color': '#f5222d', // 错误色
      '@font-size-base': '14px', // 主字号
      '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
      '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
      '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
      '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
      '@border-radius-base': '2px', // 组件/浮层圆角
      '@border-color-base': '#d9d9d9', // 边框色
      '@box-shadow-base':
        '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
    },
  },
};
