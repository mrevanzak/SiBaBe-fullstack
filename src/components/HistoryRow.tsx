import { useHover } from '@mantine/hooks';
import moment from 'moment';
import Link from 'next/link';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Separator from '@/components/Separator';

import { Orders } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

type HistoryRowProps = {
  history: Orders;
};

export default function HistoryRow({ history }: HistoryRowProps) {
  const { hovered, ref } = useHover();

  return (
    <div ref={ref}>
      <Link href={`/history/${history.id}`}>
        <div className='relative flex cursor-pointer justify-between  py-8 transition-all duration-200'>
          <div className=''>
            <p className='text-sm'>Pembelian pada</p>
            <p className='font-secondary text-xl font-bold'>
              {moment(history.created_at).format('DD - MM - YYYY')}
            </p>
          </div>
          <div className='absolute left-1/3'>
            <p className='text-sm'>Kode pemesanan</p>
            <p className='font-secondary text-xl font-bold'>{history.id}</p>
          </div>
          <p className='self-center font-secondary font-bold'>
            Rp {thousandSeparator(history.total_price)}
          </p>
        </div>
        <Separator
          height={2}
          color='#D9D9D9BF'
          className={clsxm(
            'mx-auto transition-all duration-300',
            hovered ? 'w-full' : 'w-[90%]'
          )}
        />
      </Link>
    </div>
  );
}
