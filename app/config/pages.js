// Markdown-backed pages. Each `file` lives in /content and is rendered at
// build time; these are also the pages listed in the admin editor.
const pages = [
  { slug: 'about',    title: 'About Us',     href: '/about',          file: 'about.md' },
  { slug: 'officers', title: 'Officers',     href: '/about/officers', file: 'officers.md' },
  { slug: 'history',  title: 'Club History', href: '/about/history',  file: 'history.md' },
  { slug: 'awards',   title: 'Awards',       href: '/awards',         file: 'awards.md' },
  { slug: 'ratcup',   title: 'The Rat Cup',  href: '/ratcup',         file: 'ratcup.md' },
  { slug: 'mousecup', title: 'The Mouse Cup', href: '/mousecup',      file: 'mousecup.md' },
  { slug: 'links',    title: 'Useful Links', href: '/links',          file: 'links.md' },
];

export default pages;
