import { defineConfig } from 'dumi';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: '@blacklake-web',
  favicon: process.env.NODE_ENV === 'production' ? './favicon.ico' : './public/favicon.ico',
  logo: process.env.NODE_ENV === 'production' ? './favicon.ico' : './public/favicon.ico',
  outputPath: 'docs-dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/foundation/' : '/',
  base: process.env.NODE_ENV === 'production' ? '/foundation/' : '/',
  mode: 'site',
  navs: [
    null,
    {
      title: 'Github',
      path: 'https://github.com/blacklake-web/foundation#readme',
    },
  ],
  theme: {
    'primary-color': '#02B980',
    'error-color': '#f5222d',
    'border-color-base': '#d9d9d9',
  },
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
});
