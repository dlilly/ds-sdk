import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds/client'
import { PickupLocation } from '../model/location'
import { editPickupLocation, selectLocation, tableizeLocations } from '../ui/location'

export const command = 'location'
export const description = 'manage locations'

export const builder = (yargs: any): any =>
  yargs
    .middleware(async (context: { ds: DeliverySolutionsClient, storeExternalId?: string, location?: PickupLocation }, y: any) => {
      if (context.storeExternalId) {
        try {
          context.location = await context.ds.location.getOne(context.storeExternalId)
        } catch (error) {
          throw new Error(`${chalk.redBright('error')} location ${chalk.green(context.storeExternalId)} not found`)
        }
      }
    })
    .command("list", "list locations", {}, async (context: { ds: DeliverySolutionsClient }) => {
      tableizeLocations(await context.ds.location.get())
    })
    .command("get [storeExternalId]", "get a location by storeExternalId", {}, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) => {
      tableizeLocations([await selectLocation(context)])
    })
    .command("create", "create a location", {}, async function (context: { ds: DeliverySolutionsClient }) {
      const created = await context.ds.location.create(await editPickupLocation(context))
      tableizeLocations([created])
      console.log(`${chalk.greenBright('success')} created location ${created.storeExternalId}`)
    })
    .command("update [storeExternalId]", "update a location", {}, async function (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) {
      context.location = context.location || await selectLocation(context)
      const updated = await context.ds.location.update(await editPickupLocation(context))
      tableizeLocations([updated])
      console.log(`${chalk.greenBright('success')} updated location ${updated.storeExternalId}`)
    })
    .help();