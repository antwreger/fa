export const site = {
  name: 'Fåfängans Antik',
  description: 'Antikviteter och vintagebijouterier i Haga, Göteborg.',
  address: {
    street: 'Haga Nygata 16',
    postal: '413 01 Göteborg',
  },
  phone: {
    landline: '031-711 06 16',
    landlineHref: 'tel:+46317110616',
    mobile: '0709-14 97 25',
    mobileHref: 'tel:+46709149725',
  },
  hours: [
    { days: 'Måndag–fredag', time: '12–18' },
    { days: 'Lördag', time: '11–16' },
  ],
  instagram: {
    label: '@fafangansantik',
    href: 'https://www.instagram.com/fafangansantik/',
  },
  map: 'https://www.google.com/maps/search/?api=1&query=F%C3%A5f%C3%A4ngans+Antik%2C+Haga+Nygata+16%2C+G%C3%B6teborg',
} as const;

export const navigation = [
  { label: 'Sortiment', href: '#sortiment' },
  { label: 'Antikviteter', href: '#antikviteter' },
  { label: 'Smycken', href: '#antika-smycken' },
  { label: 'Bijoux', href: '#vintage-bijoux' },
  { label: 'Om oss', href: '#om-oss' },
] as const;
