import { Arguments } from 'yargs'
import { DeliverySolutionsClient, DSClient } from '../ds-client'

const middleware = (context: Arguments<{ ds?: DeliverySolutionsClient, dsTenantId?: string, dsApiKey?: string }>): any => {
    if (!context.ds) {
        const tenantId = context.dsTenantId || process.env['DS_TENANT_ID']
        const apiKey = context.dsApiKey || process.env['DS_API_KEY']
    
        if (!tenantId || !apiKey) {
            throw new Error(`api key or tenant id missing`)
        }
    
        context.ds = DSClient(tenantId, apiKey)
    }
}

export { middleware }