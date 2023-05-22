import chalk from "chalk"
import Table from "cli-table"

import { DeliverySolutionsClient } from "../ds-client"
import { PickupLocation } from "../model/location"
import { addressToString } from "./address"

const buildPickupLocation = async(ds: DeliverySolutionsClient) => {
}

const selectLocation = async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }): Promise<PickupLocation> => context.location || await context.ds.selectPickupLocation()

const tableizeLocations = (locations: PickupLocation[]) => {
    const table = new Table({
      head: ['name\nstoreExternalId', 'contact', 'address', 'currency'],
      colWidths: [30, 20, 30, 10]
    })
  
    locations.forEach(loc => {
      table.push([`${loc.name}\n${chalk.cyan(loc.storeExternalId)}`, `${loc.contact.name}\n${loc.contact.phone}`, addressToString(loc.address), `${loc.currencyCode}`])
    })
  
    console.log(table.toString())
  }
  
export { buildPickupLocation, selectLocation, tableizeLocations }