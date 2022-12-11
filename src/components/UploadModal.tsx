import { Group, Image, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import axios from 'axios';
import * as React from 'react';
import { FiImage, FiUpload, FiXCircle } from 'react-icons/fi';

import { useAppDispatch } from '@/hooks/redux';

import Button from '@/components/buttons/Button';

import { API_KEY } from '@/pages/api/products';
import { confirmPayment } from '@/redux/actions/Checkout';

type UploadModalProps = {
  setOpened: (value: boolean) => void;
  invoice: string;
};

export default function UploadModal({ setOpened, invoice }: UploadModalProps) {
  const dispatch = useAppDispatch();
  const [files, setFiles] = React.useState<FileWithPath[]>([]);
  const [loading, setLoading] = React.useState(false);

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

  const onUpload = () => {
    setLoading(true);
    const instance = axios.create({
      baseURL: 'https://api.imgbb.com/1',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    instance
      .post('/upload', {
        key: API_KEY,
        image: files[0],
      })
      .then((res) => {
        setLoading(false);
        if (invoice) {
          dispatch(confirmPayment(invoice, res.data.data.medium.url));
          setOpened(false);
        }
      });
    // .catch((err) => {
    //   setLoading(false);
    //   console.log(err);
    // });
  };

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      <div className='flex flex-col space-y-6 p-14'>
        <Dropzone
          onDrop={setFiles}
          // onReject={(files) => console.log('rejected files', files)}
          maxSize={25 * 1024 * 1024}
          accept={IMAGE_MIME_TYPE}
          multiple={false}
          styles={{
            root: { backgroundColor: 'transparent' },
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
        <Button
          className='mx-auto rounded-2xl bg-brown py-4 px-20'
          onClick={onUpload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
