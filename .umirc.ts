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
  mfsu: {},
  themeConfig: {
    '@primary-color': '#02b980',
    '@c-primary': '#02b980',
    '@c-heading': '#02b980',
    '@c-text': '#02b980',
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
