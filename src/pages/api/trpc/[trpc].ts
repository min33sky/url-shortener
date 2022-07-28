import * as trpc from '@trpc/server';
import { prisma } from '@/db/client';
import * as trpcNext from '@trpc/server/adapters/next';
import z from 'zod';

export const appRouter = trpc
  .router()
  .query('slugCheck', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ ctx, input }) {
      const count = await prisma.shortLink.count({
        where: {
          slug: input.slug,
        },
      });

      return { used: count > 0 };
    },
  })
  .mutation('createSlug', {
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input }) {
      try {
        const result = await prisma.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });

        return result;
      } catch (e) {
        console.error(e);
      }
    },
  });

export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
