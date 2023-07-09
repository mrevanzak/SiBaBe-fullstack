import { useUser } from '@clerk/nextjs';
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
  const { user, isSignedIn } = useUser();

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main my-6 flex flex-row items-center'>
          <div className=''>
            <p className='text-base font-semibold'>
              Halo, Selamat Datang {user?.fullName}!
            </p>
            <h1 className='pt-3 text-5xl font-extrabold leading-tight'>
              Dapatkan Roti Premium Terlezat Buatan Kami
            </h1>
            <p className='pt-4'>Coba dan rasakan pelayanan terbaik dari kami</p>
            <p>Daftar sekarang gratis</p>
            {!isSignedIn && (
              <div className='flex gap-4 pt-6'>
                <ButtonLink
                  href='/auth/register'
                  className='rounded-2xl bg-brown px-20 py-4'
                >
                  Daftar
                </ButtonLink>
                <ButtonLink
                  href='/auth/login'
                  variant='outline'
                  className='rounded-2xl px-20 py-4'
                >
                  Login
                </ButtonLink>
              </div>
            )}
          </div>
          <Logo className='h-full w-10/12' />
        </div>
      </main>
    </Layout>
  );
}
