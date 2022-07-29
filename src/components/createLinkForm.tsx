import type { NextPage } from 'next';
import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import debounce from 'lodash/debounce';
import copy from 'copy-to-clipboard';
import { trpc } from '@/utils/trpc';

type Form = {
  slug: string;
  url: string;
};

const CreateLinkForm: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: '', url: '' });
  const url = window.location.origin;

  const slugCheck = trpc.useQuery(['slugCheck', { slug: form.slug }], {
    refetchOnReconnect: false, // replacement for enable: false which isn't respected.
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { mutate, isSuccess, reset } = trpc.useMutation(['createSlug']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ ...form });
  };

  /**
   *? Slug 입력 핸들러
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    debounce(slugCheck.refetch, 100);
  };

  if (isSuccess) {
    return (
      <section className="bg-slate-200 w-[90vmin] max-w-2xl px-4 py-10 rounded-md shadow-md flex flex-col justify-center items-center">
        <div className="flex justify-center items-center space-x-4">
          <h1 className="text-lg">{`${url}/${form.slug}`}</h1>
          <input
            type="button"
            value="Copy Link"
            className="btn"
            onClick={() => {
              copy(`${url}/${form.slug}`);
            }}
          />
        </div>

        <input
          type="button"
          value="Reset"
          className="btn"
          onClick={() => {
            reset();
            setForm({ slug: '', url: '' });
          }}
        />
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-slate-100 rounded-md shadow-md py-10 px-4 justify-center w-[90vmin] max-w-2xl"
    >
      <h1 className="text-center text-2xl text-violet-700">URL Shortener</h1>

      <span className="font-medium h-4 text-center text-red-500">
        {slugCheck.data?.used ? 'Slug already in use...🤗' : ''}
      </span>

      <div aria-label="Slug 입력" className="flex flex-wrap sm:space-x-2">
        <div className="flex justify-center items-center">
          <span className="text-slate-600 text-lg">{url}/</span>
          <input
            type="text"
            name="slug"
            onChange={handleChange}
            minLength={1}
            placeholder="ex) newyork"
            className={`input ${
              slugCheck.data?.used && 'text-red-500 border-red-500'
            }`}
            value={form.slug}
            pattern={'^[-a-zA-Z0-9]+$'}
            title="Only alphanumeric characters and hypens are allowed. No spaces."
            required
          />
        </div>
        <input
          type="button"
          value="Random"
          className="btn"
          onClick={() => {
            const slug = nanoid();
            setForm({
              ...form,
              slug,
            });
            slugCheck.refetch();
          }}
        />
      </div>

      <div
        aria-label="URL 입력"
        className="flex justify-between items-center space-x-3"
      >
        <span className="text-violet-500 text-lg">Link</span>
        <input
          type="url"
          name="url"
          onChange={handleChange}
          placeholder="https://www.google.com/"
          className="input"
          required
        />
      </div>

      <input
        type="submit"
        value="Create"
        className={`btn disabled:bg-slate-400 disabled:cursor-not-allowed`}
        disabled={
          (slugCheck.isFetched && slugCheck.data!.used) ||
          form.slug === '' ||
          form.url === ''
        }
      />
    </form>
  );
};

export default CreateLinkForm;
