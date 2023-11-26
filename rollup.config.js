import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
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
  external: [],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
  ],
};
