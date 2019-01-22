const { name } = require('../../package.json');

module.exports = {
  base: `/${name}/`,
  title: 'Vue Simple Micro Frontends',
  description: '以微服务的形式开发 Vue 应用。',
  themeConfig: {
    nav: [
      // for array wrap
      { text: '主项目', link: '/entry-project.html' },
      { text: '子项目', link: '/sub-project.html' },
    ],
    lastUpdated: true,
    repo: 'https://github.com/zh-rocco/vue-simple-micro-frontends',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: '编辑此页面！',
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10,
      },
    ],
    // '@vuepress/back-to-top',
  ],
};
