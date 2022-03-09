// import DefaultBundle, * as ModuleBundle from 'esbuild'
// import DefaultTraverse, * as ModuleTraverse from '@babel/traverse'
import DefaultChangeCase, * as ModuleChangeCase from 'change-case'

// const { 'build': Bundle } = DefaultBundle || ModuleBundle
// const { 'default': Traverse } = DefaultTraverse || ModuleTraverse
debugger
const { 'pascalCase': PascalCase } = DefaultChangeCase || ModuleChangeCase

async function main() {

  try {

    console.log('Hello, world!')

  } catch (error) {
    console.error(error)
  }

}

main()

