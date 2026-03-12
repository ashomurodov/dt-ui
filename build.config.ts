import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/cli/index'],
  outDir: 'dist',
  clean: true,
  rollup: {
    emitCJS: false,
    inlineDependencies: true,
  },
  declaration: false,
})
