const { Input } = require('enquirer')

import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds-client'
import { PickupLocation } from '../model/location'
import { tableizeRates } from '../ui/rate'
import { selectLocation } from '../ui/location'

export const command = 'rate'
export const description = 'get rates'

const rateBuilder = (yargs: any): any =>
    yargs
        .option('l', {
            alias: 'pickupLocation',
            describe: 'pickup location id'
        })
        .option('z', {
            alias: 'zipcode',
            describe: 'delivery zipcode',
            type: 'string'
        })

export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, pickupLocation?: string, location?: PickupLocation }, y: any) => {
            if (context.pickupLocation) {
                try {
                    context.location = await context.ds.location.getOne(context.pickupLocation)
                } catch (error) {
                    throw new Error(`${chalk.redBright('error')} location ${chalk.green(context.pickupLocation)} not found`)
                }
            }
        })
        .command("get", "get rates", rateBuilder, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation, zipcode?: string }) => {
            const location = await selectLocation(context)
            const zipcode = context.zipcode || await new Input({
                message: 'delivery zip code'
            }).run()

            const result = await context.ds.rate.get(location, zipcode)
            tableizeRates(result)
        })
        .help();