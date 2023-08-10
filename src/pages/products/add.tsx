import { Group, Image, Text } from '@mantine/core';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FiImage, FiUpload, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { rspc } from '@/lib/rspc';
import { storageClient } from '@/lib/supabase';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { AddProductArgs } from '@/utils/api';

export default function AddProductPage() {
  const { mutate } = rspc.useMutation(['products.create'], {
    meta: { message: 'Berhasil menambah produk' },
  });

  const [files, setFiles] = React.useState<FileWithPath[]>([]);
  const [loading, setLoading] = React.useState(false);

  //#region  //*=========== Form ===========
  const methods = useForm<AddProductArgs>({
    mode: 'onTouched',
  });
  const { handleSubmit, reset, getValues } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit = handleSubmit(async (data) => {
    if (files.length === 0) {
      toast.error('Gambar harus diisi');
      return;
    }

    await onUpload();
    const { data: image } = storageClient
      .from('product')
      .getPublicUrl(
        `product_${getValues('name')}.${files[0].path?.split('.').pop()}`
      );

    mutate(
      {
        name: data.name,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.description,
        image: image.publicUrl,
      },
      {
        onSuccess: () => {
          setLoading(false);
          reset();
          setFiles([]);
        },
      }
    );
  });
  //#endregion  //*======== Form Submit ===========

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
      .from('product')
      .upload(
        `product_${getValues('name')}.${files[0].path?.split('.').pop()}`,
        files[0]
      );

    if (error) return toast.error(error.message);
    if (!data?.path)
      return toast.error('Terjadi kesalahan saat mengupload gambar');

    return data.path;
  };

  return (
    <Layout>
      <Seo />
      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Tambah Produk Baru</p>
          <div className='mx-8 space-y-9 overflow-hidden rounded-3xl bg-grey'>
            <div>
              <Dropzone
                onDrop={setFiles}
                onReject={() => toast.error('File tidak sesuai')}
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
            <FormProvider {...methods}>
              <form
                className='flex w-full flex-col space-y-2 px-12 pb-12'
                id='form'
                onSubmit={onSubmit}
              >
                <Input
                  id='name'
                  label='Nama'
                  placeholder='Isi nama produk'
                  validation={{
                    required: 'Nama produk harus diisi',
                  }}
                />
                <Input
                  id='price'
                  label='Harga'
                  placeholder='Isi harga produk'
                  validation={{
                    required: 'Harga produk harus diisi',
                  }}
                />
                <Input
                  id='stock'
                  label='Stock'
                  placeholder='Isi stock produk'
                  validation={{
                    required: 'Stock produk harus diisi',
                  }}
                />
                <TextArea
                  id='description'
                  label='Deskripsi'
                  placeholder='Isi deskripsi produk'
                  validation={{
                    required: 'Deskripsi produk harus diisi',
                  }}
                  rows={4}
                />
              </form>
            </FormProvider>
          </div>
          <div className='mt-9 flex items-center justify-end gap-7'>
            <Button
              className='rounded-3xl px-10 py-6 font-secondary'
              variant='outline'
              type='submit'
              form='form'
            >
              Tambahkan Produk
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
