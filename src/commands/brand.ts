import { Brand } from '../model/brand'
import { DeliverySolutionsClient } from '../ds-client'

import chalk from 'chalk'
import { selectBrand, brandQuestionnaire, tableizeBrands } from '../ui/brand'

export const command = 'brand'
export const description = 'manage brands'

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