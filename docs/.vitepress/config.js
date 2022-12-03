export default {
  title: "XG's Blog",
  description: '前端学习笔记',
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: 'Vue, VitePress, Starter' }],
  ],
  themeConfig: {
    siteTitle: "XG's Blog",
    nav: [
      { text: '笔记', link: '/note/index' },
    ],
    sidebar: {
      '/note/': [
        {
          text: '分类',
          collapsible: true,
          items: [
            { text: 'HTML', link: '/note/HTML' },
            { text: 'CSS', link: '/note/CSS' },
            { text: 'JavaScript', link: '/note/JavaScript' },
            { text: 'Vue', link: '/note/Vue' },
            { text: 'React', link: '/note/React' },
            { text: 'TypeScript', link: '/note/TypeScript' },
            { text: 'Webpack', link: '/note/Webpack' },
            { text: '性能优化与HTTP', link: '/note/性能优化与HTTP' },
            { text: '项目', link: '/note/项目' },
            { text: '算法', link: '/note/算法' },
          ]
        }
      ],
    },
    socialLinks: [
      { icon: 'github', link: '' },
      // { icon: { svg: '<svg t="1668510152920" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3805" width="200" height="200"><path d="M544.949 561.422s0-71.387-34.779-75.050c-34.779-3.663-142.775 0-142.775 0v-219.654h161.078s-1.83-73.219-32.949-73.219h-261.755l43.93-117.148s-65.897 3.663-89.692 45.761-98.844 252.604-98.844 252.604 25.627 10.983 67.726-20.134c42.101-31.116 56.743-86.033 56.743-86.033l76.879-3.663 1.83 223.316s-133.621-1.83-161.078 0c-27.457 1.83-42.101 75.050-42.101 75.050h203.182s-18.307 124.47-69.557 214.164c-53.085 89.692-151.929 161.078-151.929 161.078s71.387 29.287 140.947-10.983c69.557-42.101 120.811-223.316 120.811-223.316l162.912 203.182s14.643-97.013-1.83-124.47c-18.307-27.457-113.49-137.283-113.49-137.283l-42.101 36.607 29.287-120.811h177.552zM587.050 188.010l-1.83 660.793h65.897l23.795 82.37 115.321-82.37h162.912v-660.793h-366.091zM879.92 775.584h-76.879l-97.013 75.050-21.965-75.050h-20.134v-512.527h215.991v512.527z" fill="" p-id="3806"></path></svg>' }, link: 'https://www.zhihu.com/people/clown-95-18' },
    ],
    lastUpdatedText: '上次更新时间',

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    logo: '/logo.svg',

  },


}