import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: './src/index.ts',
  output: [{
    format: 'umd',
    file: './dist/index.js',
    name: 'apinion',
    sourcemap: true,
  }, {
    format: 'es',
    file: './dist/index.mjs',
    name: 'apinion',
    sourcemap: true,
  }],
  external: ['express', 'stream', 'http', '@babel/runtime/helpers/typeof'],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.ts']
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      rootDir: './src'
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: ['.js', '.ts'],
    }),
  ],
};
