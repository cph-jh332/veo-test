import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from '@veo-test/trpc';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
)

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
