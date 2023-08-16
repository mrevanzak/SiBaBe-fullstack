import { Group, Image, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import axios from 'axios';
import * as React from 'react';
import { BsPlusLg } from 'react-icons/bs';
import { FiImage, FiUpload, FiXCircle } from 'react-icons/fi';
import { RiCloseFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

import Button from '@/components/buttons/Button';
import Separator from '@/components/Separator';

import { API_KEY } from '@/pages/api/products';

type AddProductionProps = {
  setOpened: (opened: boolean) => void;
};

export default function AddProduction({ setOpened }: AddProductionProps) {
  const [name, setName] = React.useState(['']);
  const [totalPrice, setTotalPrice] = React.useState([0]);
  const dateRef = React.useRef<HTMLInputElement>(null);

  const [files, setFiles] = React.useState<FileWithPath[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.error('Gambar harus diisi');
      return;
    }

    if (dateRef.current) {
      const date = dateRef.current.value;
      const image = await onUpload();

      for (let i = 0; i < name.length; i++) {
        // dispatch(addProduction(date, name[i], totalPrice[i], image));
      }
      setOpened(false);
    }
  };

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <Image
        key={index}
        src={imageUrl}
        alt={file.name}
        imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
      />
    );
  });

  const onUpload = async () => {
    setLoading(true);
    const instance = axios.create({
      baseURL: 'https://api.imgbb.com/1',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return instance
      .post('/upload', {
        key: API_KEY,
        image: files[0],
      })
      .then((res) => {
        setLoading(false);
        return res.data.data.url as string;
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.log(err);
    // });
  };

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      <div className='gap-24 pb-8'>
        <div>
          <RiCloseFill
            className='absolute right-7 top-7 z-10 cursor-pointer text-4xl'
            onClick={() => setOpened(false)}
          />
          <div>
            <Dropzone
              onDrop={setFiles}
              // onReject={(files) => console.log('rejected files', files)}
              maxSize={25 * 1024 * 1024}
              accept={IMAGE_MIME_TYPE}
              multiple={false}
              styles={{
                root: {
                  backgroundColor: 'rgba(217, 217, 217, 0.5)',
                  border: 'none',
                },
              }}
              loading={loading}
            >
              <div className=' w-40'>{previews}</div>
              <Group
                position='center'
                spacing='xl'
                style={{ minHeight: 220, pointerEvents: 'none' }}
              >
                <Dropzone.Accept>
                  <FiUpload size={50} className='text-blue-500' />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <FiXCircle size={50} className='text-red-500' />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <FiImage size={50} />
                </Dropzone.Idle>
                <div>
                  <Text size='xl' inline>
                    Geser file gambar ke sini atau klik untuk upload
                  </Text>
                  <Text size='sm' color='dimmed' inline mt={7}>
                    File tidak boleh lebih dari 25MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
            <Separator height={1.5} width='50%' className='mx-auto' />
          </div>
          <div className='mx-14 mt-7 space-y-4'>
            <h3 className='text-center font-secondary'>
              Data Produksi Tambahan
            </h3>
            <form className='flex flex-col' id='form' onSubmit={handleSubmit}>
              <label className='ml-5'>Tanggal</label>
              <input
                className='w-full rounded-full border-none'
                type='date'
                required
                ref={dateRef}
              />
              <Separator width='30%' height={1} className='mx-auto my-5' />

              {name?.map((_, index) => (
                <div className='my-2 flex flex-row gap-12' key={index}>
                  <div className='flex flex-1 flex-col'>
                    <label className='ml-5'>Nama</label>
                    <input
                      className='rounded-full border-none'
                      type='text'
                      placeholder='Fill the name of additional Product'
                      required
                      value={name[index]}
                      onChange={(e) => {
                        setName((prev) => {
                          const arr = [...prev];
                          arr[index] = e.target.value;
                          return arr;
                        });
                      }}
                    />
                  </div>
                  <div className='flex flex-1 flex-col'>
                    <label className='ml-5'>Harga</label>
                    <input
                      className='rounded-full border-none'
                      type='text'
                      placeholder='Fill the price of it'
                      required
                      value={totalPrice[index]}
                      onChange={(e) => {
                        setTotalPrice((prev) => {
                          const arr = [...prev];
                          arr[index] = Number(e.target.value);
                          return arr;
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
              <div
                className='animated-underline custom-link my-3 mr-2 flex cursor-pointer flex-row items-center gap-2 self-end border-b border-dotted border-dark hover:border-black/0'
                onClick={() => {
                  setName([...name, '']);
                  setTotalPrice([...totalPrice, 0]);
                }}
              >
                <p className='text-sm'>Tambah Data </p>
                <BsPlusLg />
              </div>

              <Button
                className='self-center rounded-full border-none bg-brown px-24 py-4 font-secondary font-bold'
                type='submit'
                form='form'
              >
                Simpan
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
