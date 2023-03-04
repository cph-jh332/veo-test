import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@veo-test/trpc';
 
// Notice the <AppRouter> generic here.
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

export default trpc;
