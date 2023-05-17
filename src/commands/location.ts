import chalk from 'chalk'
import { input, select } from '@inquirer/prompts'
import { Brand } from '../model/brand'
import { Address } from "../model/address"
import { DeliverySolutionsClient } from '../ds-client'
import { buildPickupLocation } from '../model/location'

export const command = 'location'
export const description = 'manage locations'

export const builder = (yargs: any): any =>
  yargs
    .command("list", "list locations", {}, async (context: { ds: DeliverySolutionsClient }) => {
        const locations = await context.ds.getPickupLocations()
        console.log(locations)

        await buildPickupLocation(context.ds)
    })
    // .command("get [brandExternalId]", "get a brand by its brandExternalId", {}, async (context: { ds: DeliverySolutionsClient, brandExternalId?: string }) => {
    //     const brand = context.brandExternalId ? await context.ds.getBrand(context.brandExternalId) : await selectBrand(context.ds)
    //     console.log(brand)
    // })
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