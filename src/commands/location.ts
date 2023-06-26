import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds/client'
import { PickupLocation } from '../model/location'
import { editPickupLocation, selectLocation, tableizeLocations } from '../ui/location'
import { filterInactive, showInactiveBuilder } from '../helpers/ds-middleware'

export const command = 'location'
export const description = 'manage locations'

export const builder = (yargs: any): any =>
  yargs
    .middleware(async (context: { ds: DeliverySolutionsClient, storeExternalId?: string, location?: PickupLocation }, y: any) => {
      if (context.storeExternalId) {
        try {
          context.location = await context.ds.location.getOne(context.storeExternalId)
        } catch (error) {
          throw `${chalk.redBright('error')} location ${chalk.green(context.storeExternalId)} not found`
        }
      }
    })
    .command("create", "create a location", {}, async function (context: { ds: DeliverySolutionsClient }) {
      const created = await context.ds.location.create(await editPickupLocation(context))
      tableizeLocations([created])
      console.log(`${chalk.greenBright('success')} created location ${created.storeExternalId}`)
    })
    .command("edit [storeExternalId]", "edit a location", {}, async function (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) {
      context.location = context.location || await selectLocation(context)
      const updated = await context.ds.location.update(await editPickupLocation(context))
      tableizeLocations([updated])
      console.log(`${chalk.greenBright('success')} updated location ${updated.storeExternalId}`)
    })
    .command("get [storeExternalId]", "get a location by storeExternalId", {}, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) => {
      tableizeLocations([await selectLocation(context)])
    })
    .command("list", "list locations", showInactiveBuilder, async (context: { ds: DeliverySolutionsClient, showInactive?: boolean }) => {
      tableizeLocations(filterInactive(await context.ds.location.get(), context))
    })
    .help();