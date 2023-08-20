import { Rating, Textarea } from '@mantine/core';
import * as React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Separator from '@/components/Separator';

type ReviewModalProps = {
  historyId: string;
  id: string;
  setOpened: (opened: boolean) => void;
};

export default function ReviewModal({
  setOpened,
  id,
  historyId,
}: ReviewModalProps) {
  const queryClient = rspc.useContext().queryClient;
  const { data: user } = rspc.useQuery(['users.get']);
  const { mutate } = rspc.useMutation(['reviews.create'], {
    meta: { message: 'Ulasan berhasil dikirim' },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders.show', historyId]);
      setOpened(false);
    },
  });

  const [rating, setRating] = React.useState(0);
  const reviewRef = React.useRef<HTMLTextAreaElement>(null);

  const onSubmit = () => {
    if (rating === 0) {
      return toast.warn('Beri rating terlebih dahulu');
    }
    if (reviewRef.current && user) {
      mutate({
        rating,
        feedback: reviewRef.current.value,
        order_id: historyId,
        product_id: id,
        name: user.name,
      });
    }
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
            className='mr-10 rounded-full px-28 py-6 font-secondary'
            variant='outline'
            onClick={onSubmit}
          >
            Kirim
          </Button>
        </div>
        <Textarea
          value={user?.name}
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
        className='absolute right-7 top-7 cursor-pointer text-4xl'
        onClick={() => setOpened(false)}
      />
    </div>
  );
}
