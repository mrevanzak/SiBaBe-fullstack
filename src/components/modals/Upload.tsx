import { Group, Image, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { produce } from 'immer';
import * as React from 'react';
import { FiImage, FiUpload, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { rspc } from '@/lib/rspc';
import { storageClient } from '@/lib/supabase';

import Button from '@/components/buttons/Button';

import type { OrderWithCart } from '@/utils/api';

type UploadModalProps = {
  setOpened: (value: boolean) => void;
  invoice: string;
};

export default function UploadModal({ setOpened, invoice }: UploadModalProps) {
  const { mutate } = rspc.useMutation(['orders.confirm']);
  const queryClient = rspc.useContext().queryClient;

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

  const onUpload = async () => {
    setLoading(true);
    const { data, error } = await storageClient
      .from('payment')
      .upload(
        `payment_${invoice}.${files[0].path?.split('.').pop()}`,
        files[0]
      );

    if (error) return toast.error(error.message);
    if (!data?.path)
      return toast.error('Terjadi kesalahan saat mengupload bukti');
    mutate(
      { id: invoice, payment_proof: data.path },
      {
        onSuccess: () => {
          toast.success('Bukti pembayaran berhasil diupload');
          setOpened(false);
          queryClient.setQueryData<OrderWithCart>(
            ['orders.show', invoice],
            produce((oldData) => {
              if (!oldData) return;
              oldData.payment_proof = data.path;
            })
          );
        },
      }
    );
  };

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      <div className='flex flex-col space-y-6 p-14'>
        <Dropzone
          onDrop={setFiles}
          onReject={() => toast.error('File tidak sesuai')}
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
          className='mx-auto rounded-2xl bg-brown px-20 py-4'
          onClick={onUpload}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
