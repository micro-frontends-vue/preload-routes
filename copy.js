const copy = require('recursive-copy');

const task = [
  {
    src: 'entry-app/dist',
    dest: 'docs',
  },
  {
    src: 'sub-app-one/dist',
    dest: 'docs/sub-app-one',
  },
  {
    src: 'sub-app-two/dist',
    dest: 'docs/sub-app-two',
  },
];

task.forEach(({ src, dest }) => {
  copy(src, dest, (error) => {
    error && console.error('[Copy failed]', `src: ${src}, dest: ${dest}`, error);
  });
});
