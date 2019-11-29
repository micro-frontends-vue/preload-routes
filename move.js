const path = require('path')
const fs = require('fs-extra')

const tasks = [
  {
    src: 'applications/app-entry/dist',
    dest: 'docs',
  },
  {
    src: 'applications/app-typescript/dist',
    dest: 'docs/app-typescript',
  },
  {
    src: 'applications/app-javascript/dist',
    dest: 'docs/app-javascript',
  },
]

fs.removeSync(path.resolve(__dirname, 'dist'))

for (const { src, dest } of tasks) {
  fs.moveSync(path.resolve(__dirname, src), path.resolve(__dirname, dest))
  console.log('\x1b[1m%s\x1b[31m%s\x1b[0m', '[Copy]: ', `src: ${src}, dest: ${dest}`, 'success.')
}
