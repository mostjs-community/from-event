import buble from 'rollup-plugin-buble'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  plugins: [
    buble()
  ],
  external: ['@most/scheduler'],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'most.fromEvent',
      sourcemap: true,
      globals: {
        '@most/scheduler': 'mostScheduler'
      }
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
}
