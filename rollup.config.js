import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.ts', // 入口文件
  output: [
    {
      format: 'umd',
      file: 'dist/blComponent.js', // 打包后输出文件
      name: 'blComponent',
    },
    {
      format: 'umd',
      file: 'dist/blComponent.min.js',
      name: 'blComponent',
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    // ts支持
    typescript(),
    // commonjs类型库
    commonjs(),
    // 解析json文件
    json(),
  ],
};
