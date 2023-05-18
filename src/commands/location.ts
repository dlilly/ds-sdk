import chalk from 'chalk'
import { input, select } from '@inquirer/prompts'
import { Brand } from '../model/brand'
import { Address, addressToString } from "../model/address"
import { DeliverySolutionsClient } from '../ds-client'
import { PickupLocation, buildPickupLocation, selectLocation } from '../model/location'
import Table from 'cli-table'

export const command = 'location'
export const description = 'manage locations'

const tableizeLocations = (locations: PickupLocation[]) => {
  const table = new Table({
    head: ['name\nstoreExternalId', 'contact', 'address', 'currency'],
    colWidths: [30, 20, 30, 10]
  })

  console.log(locations)

  locations.forEach(loc => {
    table.push([`${loc.name}\n${chalk.cyan(loc.storeExternalId)}`, `${loc.contact.name}\n${loc.contact.phone}`, addressToString(loc.address), `${loc.currencyCode}`])
  })

  console.log(table.toString())
}

export const builder = (yargs: any): any =>
  yargs
    .middleware(async (context: { ds: DeliverySolutionsClient, storeExternalId?: string, location?: PickupLocation }, y: any) => {
      console.log(`middleware says storeExternalId is ${context.storeExternalId}`)
      if (context.storeExternalId) {
        try {
          context.location = await context.ds.getPickupLocation(context.storeExternalId)
          console.log(`setLocation ${context.location.name}`)
        } catch (error) {
          throw new Error(`${chalk.redBright('error')} location ${chalk.green(context.storeExternalId)} not found`)
        }
      }
    })
    .command("list", "list locations", {}, async (context: { ds: DeliverySolutionsClient }) => {
      const locations = await context.ds.getPickupLocations()
      tableizeLocations(locations)

      // await buildPickupLocation(context.ds)
    })
    .command("get [storeExternalId]", "get a location by storeExternalId", {}, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) => {
      tableizeLocations([await selectLocation(context)])
    })
    // .command("add", "add a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
    //     const brand = await brandQuestionnaire()
    //     console.log(brand)

    //     try {
    //         const returned = await context.ds.createBrand(brand)
    //         console.log(returned)
    //     } catch (error) {
    //         console.log(`error: ${error}`)
    //     }
    // })
    // .command("delete", "delete a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
    //     await selectBrand(context.ds)
    // })
    .help();