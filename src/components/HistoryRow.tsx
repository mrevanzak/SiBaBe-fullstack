import moment from 'moment';
import { useRouter } from 'next/router';
import * as React from 'react';

import Separator from '@/components/Separator';

import thousandSeparator from '@/util/thousandSeparator';

import { OrderData } from '@/types';

type HistoryRowProps = {
  history: OrderData;
};

export default function HistoryRow({ history }: HistoryRowProps) {
  const router = useRouter();
  const [isHover, setIsHover] = React.useState(false);

  const onMouseOverHandler = () => {
    setIsHover(true);
  };

  const onMouseOutHandler = () => {
    setIsHover(false);
  };

  const onClickHistory = () => {
    router.push(`/history/${history.id}`);
  };

  return (
    <div
      onMouseOver={onMouseOverHandler}
      onMouseOut={onMouseOutHandler}
      onClick={onClickHistory}
    >
      <div className='relative flex cursor-pointer justify-between  py-8 transition-all duration-200'>
        <div className=''>
          <p className='text-sm'>Pembelian pada</p>
          <p className='font-secondary text-xl font-bold'>
            {moment(history.createdAt).format('DD - MM - YYYY')}
          </p>
        </div>
        <div className='absolute left-1/2'>
          <p className='text-sm'>Kode pemesanan</p>
          <p className='font-secondary text-xl font-bold'>{history.invoice}</p>
        </div>
        <p className='font-secondary font-bold'>
          Rp {thousandSeparator(history.totalPrice)}
        </p>
      </div>
      <Separator
        height={2}
        color='#D9D9D9BF'
        className={`mx-auto ${
          isHover ? 'w-full' : 'w-[90%]'
        } transition-all duration-300`}
      />
    </div>
  );
}
