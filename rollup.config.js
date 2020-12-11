import babel from 'rollup-plugin-babel';

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    file: './dist/index.js',
    name: 'apinion',
  },
  external: [],
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
  ],
};
