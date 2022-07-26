// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { slug },
  } = req;
  console.log('slug: ', slug);

  if (!slug || typeof slug !== 'string') {
    return res.status(404).json({ message: 'Pls use with a slug!!' });
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    return res.status(404).json({ message: 'Slug not found.' });
  }

  return res.json(data);
}
