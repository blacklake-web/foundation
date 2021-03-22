import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.ts', // 入口文件
  output: {
    format: 'umd',
    file: 'dist/vue.js', // 打包后输出文件
    name: 'Vue', // 打包后的内容会挂载到window，name就是挂载到window的名称
    sourcemap: true, // 代码调试 开发环境填true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    // 压缩代码
    uglify(),
    // 热更新 默认监听根文件夹
    livereload(),
    // 本地服务器
    serve({
      open: true, // 自动打开页面
      port: 8000,
      openPage: '/public/index.html', // 打开的页面
      contentBase: '',
    }),
  ],
};
