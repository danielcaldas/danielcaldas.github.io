export const PandaConfig = {
  title: '~/',
  description: 'Blogpost, note taking and other things',
  start: '2018',
  site: 'https://danielcaldas.github.io/',
  defaultLocale: 'en',
  navbar: [
    { title: 'projects', url: '/projects/' },
    { title: 'bookshelf', url: '/bookshelf/' },
    { title: 'weekly inference', url: '/the-weekly-inference/' },
  ],
  footer: [
    { title: '~/', url: '/' },
    // { title: 'rss', url: '/rss.xml/' }, // FIXME: Enable back rss, it's breaking.
    { title: 'weekly inference rss', url: '/the-weekly-inference/rss.xml' },
    { title: 'contact', url: 'mailto:caldasjdaniel@gmail.com' },
    { title: 'github', url: 'https://github.com/danielcaldas/danielcaldas.github.io' },
    { title: 'linkedin', url: 'https://www.linkedin.com/in/daniel-caldas/' },
  ],
}
