import { DeliverySolutionsClient } from '../ds/client'
import { tableizeBoundaries } from '../ui/boundary'

export const command = 'boundary'
export const description = 'manage boundaries'

const options = (yargs: any): any =>
    yargs
        .option('l', {
            alias: 'pickup-location',
            describe: 'pickup location id',
            type: 'array'
        })

export const builder = (yargs: any): any =>
    yargs
        .command("list", "list boundaries", options, async (context: { ds: DeliverySolutionsClient, pickupLocation?: string[] }) => {
            const boundaries = await context.ds.boundary.get()
            tableizeBoundaries(boundaries)
        })
        .help();