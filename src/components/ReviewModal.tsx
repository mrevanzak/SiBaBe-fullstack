import { Rating, Textarea } from '@mantine/core';
import * as React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RiCloseFill } from 'react-icons/ri';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import Button from '@/components/buttons/Button';
import Separator from '@/components/Separator';

import { addReview } from '@/redux/actions/Review';

type ReviewModalProps = {
  historyId: string;
  id: number;
  setOpened: (opened: boolean) => void;
};

export default function ReviewModal({
  id,
  setOpened,
  historyId,
}: ReviewModalProps) {
  const { user } = useAppSelector(({ user }) => user);
  const dispatch = useAppDispatch();
  const [rating, setRating] = React.useState(0);
  const reviewRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = () => {
    if (reviewRef.current) {
      dispatch(addReview(reviewRef.current.value, rating, historyId, id));
    }
    setOpened(false);
  };

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      <div className='space-y-6 p-14'>
        <div className='flex flex-row justify-between '>
          <div>
            <h4 className='font-secondary'>Beri nilai makanan</h4>
            <Rating
              value={rating}
              onChange={setRating}
              emptySymbol={<AiOutlineStar size={36} />}
              fullSymbol={<AiFillStar size={36} />}
            />
          </div>
          <Separator />
          <Button
            className='mr-10 rounded-full py-6 px-28 font-secondary'
            variant='outline'
            onClick={onSubmit}
          >
            Kirim
          </Button>
        </div>
        <Textarea
          value={user?.username}
          disabled
          placeholder='Isi nama kamu'
          label='Nama'
          radius='xl'
          withAsterisk
          autosize
          styles={{
            label: {
              fontSize: 16,
              fontWeight: 600,
            },
          }}
        />
        <Textarea
          ref={reviewRef}
          placeholder='Tulis ulasan kamu'
          label='Ulasan'
          radius='xl'
          withAsterisk
          styles={{
            label: {
              fontSize: 16,
              fontWeight: 600,
            },
            input: {
              height: 275,
            },
          }}
        />
      </div>
      <RiCloseFill
        className='absolute top-7 right-7 cursor-pointer text-4xl'
        onClick={() => setOpened(false)}
      />
    </div>
  );
}
