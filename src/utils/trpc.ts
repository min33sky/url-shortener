import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from '../pages/api/trpc/[trpc]';

//? trpc에서 제공하는 hook들을 client에서 사용할 수 있다.
export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
