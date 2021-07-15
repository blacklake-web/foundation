import { defineConfig } from 'dumi';

// more config: https://d.umijs.org/config
export default defineConfig({
  title: '@blacklake-web',
  favicon: './favicon.ico',
  logo: './favicon.ico',
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
});
