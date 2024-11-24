import { hc } from 'hono/client'
import type { AppType } from '@server/index.js'


export function getApiClient() {
    return hc<AppType>("http://localhost:3000", {
    }) as ReturnType<typeof hc<AppType>>;
}