import { hc } from 'hono/client'
import type { AppType } from '@server/index.js'


export function getApiClient() {
    return hc<AppType>("http://wkgcc00g4kkcc84c8okw4woc.89.117.32.118.sslip.io", {
    }) as ReturnType<typeof hc<AppType>>;
}