import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { mainApp as app } from './routes/routes.js'

const mainApp = new Hono();

mainApp.use('/*', cors())
const routes = mainApp
    .route("/", app);



export type AppType = typeof routes;
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: mainApp.fetch,
    port,
});