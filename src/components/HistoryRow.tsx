import * as React from 'react';

import thousandSeparator from '@/util/thousandSeparator';

import { History } from '@/types';

type HistoryRowProps = {
  history: History;
};

export default function HistoryRow({ history }: HistoryRowProps) {
  return (
    <div className='flex cursor-pointer justify-between py-8  transition-all duration-200'>
      <div className=''>
        <p className='text-sm'>Pembelian pada</p>
        <p className='font-secondary text-xl font-bold'>{history.date}</p>
      </div>
      <div className=''>
        <p className='text-sm'>Kode pemesanan</p>
        <p className='font-secondary text-xl font-bold'>{history.id}</p>
      </div>
      <p className='font-secondary font-bold'>
        Rp {thousandSeparator(history.total)}
      </p>
    </div>
  );
}
