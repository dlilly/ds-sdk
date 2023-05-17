import { DeliverySolutionsClient } from './ds-client'

const middleware = (context: any): any => {
    if (!context.ds) {
        const tenantId = process.env['DS_TENANT_ID']
        const apiKey = process.env['DS_API_KEY']
    
        if (!tenantId || !apiKey) {
            throw new Error(`api key or tenant id missing`)
        }
    
        context.ds = new DeliverySolutionsClient(tenantId, apiKey)
    }
}

export { middleware }