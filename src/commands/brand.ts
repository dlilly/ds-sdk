import { brandQuestionnaire, selectBrand } from '../model/brand'
import { DeliverySolutionsClient } from '../ds-client'

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
 */

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