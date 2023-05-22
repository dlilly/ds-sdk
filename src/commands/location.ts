import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds-client'
import { PickupLocation } from '../model/location'
import { selectLocation, tableizeLocations } from '../ui/location'

export const command = 'location'
export const description = 'manage locations'

export const builder = (yargs: any): any =>
  yargs
    .middleware(async (context: { ds: DeliverySolutionsClient, storeExternalId?: string, location?: PickupLocation }, y: any) => {
      if (context.storeExternalId) {
        try {
          context.location = await context.ds.getPickupLocation(context.storeExternalId)
        } catch (error) {
          throw new Error(`${chalk.redBright('error')} location ${chalk.green(context.storeExternalId)} not found`)
        }
      }
    })
    .command("list", "list locations", {}, async (context: { ds: DeliverySolutionsClient }) => {
      tableizeLocations(await context.ds.getPickupLocations())
    })
    .command("get [storeExternalId]", "get a location by storeExternalId", {}, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) => {
      tableizeLocations([await selectLocation(context)])
    })
    .help();