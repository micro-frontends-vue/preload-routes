const copy = require('recursive-copy');

const task = [
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
];

task.forEach(({ src, dest }) => {
  copy(src, dest, (error) => {
    error &&
      console.error('[Copy failed]', `src: ${src}, dest: ${dest}`, error);
  });
});
