export const PandaConfig = {
  title: '~/',
  description: 'Blogpost, note taking and other things',
  start: '2018',
  site: 'https://danielcaldas.github.io/',
  defaultLocale: 'en',
  newsletter: {
    // Buttondown username for The Weekly Inference mailing list.
    // See docs/newsletter.md for setup.
    buttondownUsername: 'theweeklyinference',
  },
  navbar: [
    { title: 'projects', url: '/projects/' },
    { title: 'weekly inference', url: '/the-weekly-inference/' },
    { title: 'spotlight', url: '/spotlight/' },
    { title: 'bookshelf', url: '/bookshelf/' },
  ],
  footer: [
    { title: '~/', url: '/' },
    { title: 'contact', url: 'mailto:caldasjdaniel@gmail.com' },
    { title: 'x', url: 'https://x.com/_danielcaldas' },
    { title: 'linkedin', url: 'https://www.linkedin.com/in/daniel-caldas/' },
    { title: 'github', url: 'https://github.com/danielcaldas/danielcaldas.github.io' },
    { title: 'rss', url: '/rss.xml' },
    { title: 'weekly inference rss', url: '/the-weekly-inference/rss.xml' },
  ],
}
