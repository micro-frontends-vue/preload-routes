const copy = require('recursive-copy');

const task = [
  {
    src: 'entry-app/dist',
    dest: 'docs',
  },
  {
    src: 'sub-app-ts/dist',
    dest: 'docs/sub-app-ts',
  },
  {
    src: 'sub-app-js/dist',
    dest: 'docs/sub-app-js',
  },
];

task.forEach(({ src, dest }) => {
  copy(src, dest, (error) => {
    error && console.error('[Copy failed]', `src: ${src}, dest: ${dest}`, error);
  });
});
