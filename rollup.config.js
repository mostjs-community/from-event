import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/most-from-event.js',
    name: 'mostFromEvent',
    sourceMap: true,
    format: 'umd'
  },
  plugins: [ typescript() ]
}
