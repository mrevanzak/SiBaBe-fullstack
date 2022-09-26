import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

import UnderlineLink from '../links/UnderlineLink';

const links = [
  { href: '/', label: 'Produk' },
  { href: '/', label: 'Keranjang' },
  { href: '/', label: 'Riwayat' },
  { href: '/', label: 'Toko Kami' },
];

export default function Header() {
  return (
    <header className='sticky top-0 z-50'>
      <div className='layout flex h-14 items-center justify-between'>
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
