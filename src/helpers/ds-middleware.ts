import { Arguments } from 'yargs'
import { DeliverySolutionsClient, DSClient } from '../ds/client'
import { Activatible } from '../model/common'

const middleware = (context: Arguments<{ ds?: DeliverySolutionsClient, dsTenantId?: string, dsApiKey?: string }>): any => {
    if (!context.ds) {
        const tenantId = context.dsTenantId || process.env['DS_TENANT_ID']
        const apiKey = context.dsApiKey || process.env['DS_API_KEY']
    
        if (!tenantId || !apiKey) {
            throw `api key or tenant id missing`
        }
    
        context.ds = DSClient(tenantId, apiKey)
    }
}

const showInactiveBuilder = (yargs: any): any =>
    yargs
        .option('i', {
            alias: 'showInactive',
            default: false,
            boolean: true,
            describe: 'show inactive'
        })

const filterInactive = <T extends Activatible>(arr: T[], context: { showInactive?: boolean }): T[] => arr.filter(a => context.showInactive || a.active)

export { middleware, showInactiveBuilder, filterInactive }