import { SignOutButton, useUser } from '@clerk/nextjs';
import * as React from 'react';

import useScrollPosition from '@/lib/hooks/useScrollPosition';
import useIsAdmin from '@/lib/isAdmin';

import Button from '@/components/buttons/Button';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';

const privateLinks = [
  { href: '/products', label: 'Produk' },
  { href: '/cart', label: 'Keranjang' },
  { href: '/history', label: 'Riwayat' },
];

const publicLinks = [{ href: '/products', label: 'Produk' }];

const adminLinks = [
  { href: '/products', label: 'Kelola Produk' },
  { href: '/report', label: 'Laporan Bisnis' },
  { href: '/orders', label: 'Daftar Pemesanan' },
];

export default function Header() {
  const scrollPosition = useScrollPosition();
  const { user } = useUser();

  const links = useIsAdmin() ? adminLinks : user ? privateLinks : publicLinks;

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
            {user ? (
              <SignOutButton>
                <Button className='rounded-xl bg-brown px-4 py-2 font-secondary'>
                  Logout
                </Button>
              </SignOutButton>
            ) : (
              <ButtonLink
                href='/auth/login'
                className='rounded-xl bg-brown px-4 py-2 font-secondary'
              >
                Login
              </ButtonLink>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
