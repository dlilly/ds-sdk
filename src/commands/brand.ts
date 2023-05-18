import { Brand, brandQuestionnaire, selectBrand } from '../model/brand'
import { DeliverySolutionsClient } from '../ds-client'

import Table from 'cli-table'
import { addressToString } from '../model/address'

import chalk from 'chalk'

export const command = 'brand'
export const description = 'manage brands'

/**
 * there are two api calls exposed for brands:
 * 
 * get brand details (GET /api/v2/brand/getById/brandExternalId/<brandExternalId>)
 * create brand (POST /api/v2/brand)
 * 
 * additionally, there appears to be at least one undocumented api:
 * 
 * list brands (GET /api/v2/brand)
 * 
 * Brand needs a page in the Models section
 */

const tableizeBrands = (brands: Brand[]) => {
    const table = new Table({
        head: ['name\nbrandExternalId', 'address', 'description', 'currency', 'active', 'default'],
        colWidths: [30, 20, 20, 10, 10, 10]
    })

    brands.forEach(brand => {
        table.push([`${brand.name}\n${chalk.cyan(brand.brandExternalId)}`, addressToString(brand.address), brand.description || '--', brand.currencyCode || '--', brand.active ? chalk.bold.greenBright('x') : '', brand.isDefault ? chalk.bold.greenBright('x') : ''])
    })

    console.log(table.toString())
}

const filterActiveBuilder = (yargs: any): any =>
    yargs
        .option('a', {
            alias: 'filterActive',
            default: false,
            boolean: true,
            describe: 'filter active brands'
        })

export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, brandExternalId?: string, brand?: Brand }, y: any) => {
            if (context.brandExternalId) {
                try {
                    context.brand = await context.ds.getBrand(context.brandExternalId)
                } catch (error) {
                    throw new Error(`${chalk.redBright('error')} brand ${chalk.green(context.brandExternalId)} not found`)
                }
            }
        })
        .command("list", "list brands", filterActiveBuilder, async (context: { ds: DeliverySolutionsClient, filterActive: boolean }) => {
            const brands = (await context.ds.getBrands(context)).filter(brand => context.filterActive && brand.active || !context.filterActive)
            tableizeBrands(brands)
        })
        .command("get [brandExternalId]", "get a brand by its brandExternalId or select from a list", filterActiveBuilder, async (context: { ds: DeliverySolutionsClient }) => {
            tableizeBrands([await selectBrand(context)])
        })
        .command("create", "create a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
            const brand = await brandQuestionnaire()
            console.log(brand)

            try {
                const returned = await context.ds.createBrand(brand)
                console.log(returned)
            } catch (error) {
                console.log(`error: ${error}`)
            }
        })
        .help();