// rollup.config.js
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace';
import nodeGlobals from 'rollup-plugin-node-globals';
import { uglify } from 'rollup-plugin-uglify';  // 仅支持压缩es5
import { terser } from "rollup-plugin-terser";  // 压缩es6
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';

const input = './src/index.js';
const name = 'button';
const format = 'es'
const globals = {
  react: 'React',
  // 'react-dom': 'ReactDOM',
};
const babelOptions = {
  // exclude: /node_modules/,
  exclude: 'node_modules/**',
  // We are using @babel/plugin-transform-runtime
  runtimeHelpers: true,
  // configFile: './babel.config.js',
};
const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
  namedExports: {
    '../../node_modules/react-is/index.js': ['isValidElementType'],
  },
};

export default [
  {
    input,  // 入口文件
    output: { file: `../build/${format}/${name}/${name}.development.js`, format, name, globals },  // 输出文件
    external: Object.keys(globals),  // 忽略的第三方模块
    plugins: [
      nodeResolve(),  // 查找外部依赖模块
      babel(babelOptions),  // babel转换兼容低版本浏览器
      commonjs(commonjsOptions),  // commonjs转换为ES2015模块
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
    ],
  },
  {
    input,
    output: { file: `../build/${format}/${name}/${name}.production.min.js`, format, name, globals },
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      babel(babelOptions),
      commonjs(commonjsOptions),
      nodeGlobals(), // Wait for https://github.com/cssinjs/jss/pull/893
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      // sizeSnapshot(),
      terser()
    ],
  },
];

// todo
// 1 cjs  es  umd 打包格式的区别
// 
// 2 各种打包格式在不同的插件下表现差异  比如es不能被 快照插件 压缩插件工作
//    rollup-plugin-uglify只支持压缩es5  压缩es6需要使用rollup-plugin-terser
