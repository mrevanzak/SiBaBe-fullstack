import * as React from 'react';
import { FiInstagram } from 'react-icons/fi';

import Logo from '~/svg/pancake.svg';

export default function Footer() {
  return (
    <footer className='bg-green text-white'>
      <div className='layout flex h-48 items-center justify-between '>
        <div className='flex flex-row items-center gap-20'>
          <Logo className='h-32 w-32' />
          <div className='text-sm'>
            <p>Kertajaya Surabaya</p>
            <p>BIMA BAKERY</p>
            <p>PT. BIMA JAYA UTAMA</p>
            <p>Phone : 031 - 1234567-89</p>
            <p>Fax : 031 - 7654321</p>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <p className='text-lg font-semibold'>Follow Us</p>
          <FiInstagram className='text-lg' />
        </div>
      </div>
    </footer>
  );
}
