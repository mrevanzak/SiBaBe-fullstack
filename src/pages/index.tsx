import * as React from 'react';

import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import Seo from '@/components/Seo';

import Logo from '~/svg/pancake.svg';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout flex flex-row items-center py-12'>
          <div className=''>
            <p className='text-base font-semibold'>Halo, Selamat Datang!</p>
            <h1 className='pt-3 text-5xl font-extrabold leading-tight'>
              Dapatkan Roti Premium Terlezat Buatan Kami
            </h1>
            <p className='pt-4'>Coba dan rasakan pelayanan terbaik dari kami</p>
            <p>Daftar sekarang gratis</p>
            <div className='flex gap-4 pt-6'>
              <ButtonLink href='' className='rounded-2xl bg-brown py-4 px-20'>
                Daftar
              </ButtonLink>
              <ButtonLink
                href=''
                variant='outline'
                className='rounded-2xl py-4 px-20'
              >
                Login
              </ButtonLink>
            </div>
          </div>
          <Logo className='h-full w-10/12' />
        </div>
      </main>
    </Layout>
  );
}
