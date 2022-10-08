import * as React from 'react';

import useScrollPosition from '@/hooks/useScrollPosition';

import UnstyledLink from '@/components/links/UnstyledLink';

import UnderlineLink from '../links/UnderlineLink';

const links = [
  { href: '/', label: 'Produk' },
  { href: '/', label: 'Keranjang' },
  { href: '/', label: 'Riwayat' },
  { href: '/', label: 'Toko Kami' },
];

export default function Header() {
  const scrollPosition = useScrollPosition();
  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-200 ${
        scrollPosition > 0 ? 'bg-opacity-100' : 'bg-opacity-0'
      }`}
    >
      <div className='layout flex h-[150px] items-center justify-between'>
        <UnstyledLink
          href='/'
          className='text-xl font-bold hover:text-gray-600 '
        >
          Bima Bakery
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnderlineLink href={href} className='hover:text-gray-600'>
                  {label}
                </UnderlineLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
