// Site navigation; level 1 entries render under their parent's dropdown.
const links = [
  { name: 'Home',         href: '/',               level: 0 },
  { name: 'About',        href: '/about',          level: 0 },
  { name: 'Officers',     href: '/about/officers', level: 1 },
  { name: 'History',      href: '/about/history',  level: 1 },
  { name: 'Bylaws',       href: '/about/bylaws',   level: 1 },
  { name: 'Calendar',     href: '/calendar',       level: 0 },
  { name: 'Membership',   href: '/membership',     level: 0 },
  { name: 'Awards',       href: '/awards',         level: 0 },
  { name: 'The Rat Cup',  href: '/ratcup',         level: 0 },
  { name: 'The Mouse Cup', href: '/mousecup',      level: 0 },
  { name: 'Useful Links', href: '/links',          level: 0 },
  { name: 'Contact',      href: '/contact',        level: 0 },
];

export default links;
