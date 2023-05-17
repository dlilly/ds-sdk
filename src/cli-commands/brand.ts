import chalk from 'chalk'
import { input, select } from '@inquirer/prompts'
import { Brand } from '../model/datamodel'
import { Address } from "../model/address"
import { DeliverySolutionsClient } from '../ds-client'

const brandQuestionnaire = async (): Promise<Brand> => ({
    name: await input({ message: 'name' }),
    address: await addressQuestionnaire()
})

const selectBrand = async(ds: DeliverySolutionsClient): Promise<Brand | undefined> => {
    const brands = await ds.getBrands()
    const selectedName = await select({
        message: 'select a brand',
        choices: brands.map(brand => ({
            ...brand,
            description: brand.name,
            value: brand.name
        }))
    })
    return brands.find(brand => brand.name === selectedName)
}

const addressQuestionnaire = async (): Promise<Address> => ({
    street: await input({ message: 'street' }),
    street2: await input({ message: `street 2 ${(chalk.green(`[ optional ]`))}` }),
    apartmentNumber: await input({ message: 'apartment number [ optional ]' }),
    city: await input({ message: 'city' }),
    state: await input({ message: 'state' }),
    country: await input({ message: 'country [ optional ]' }),
    zipcode: await input({ message: 'zip code' }),
})

export const command = 'brand'
export const description = 'manage brands'

export const builder = (yargs: any): any =>
  yargs
    .command("list", "list brands", {}, async (context: { ds: DeliverySolutionsClient }) => {
        const brands = await context.ds.getBrands()
        console.log(brands.map(brand => brand.brandExternalId))
    })
    .command("get [brandExternalId]", "get a brand by its brandExternalId", {}, async (context: { ds: DeliverySolutionsClient, brandExternalId?: string }) => {
        const brand = context.brandExternalId ? await context.ds.getBrand(context.brandExternalId) : await selectBrand(context.ds)
        console.log(brand)
    })
    .command("add", "add a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
        const brand = await brandQuestionnaire()
        console.log(brand)

        try {
            const returned = await context.ds.createBrand(brand)
            console.log(returned)
        } catch (error) {
            console.log(`error: ${error}`)
        }
    })
    .command("delete", "delete a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
        await selectBrand(context.ds)
    })
    .help();