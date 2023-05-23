import { DeliverySolutionsClient, DSClient } from '../ds-client'
import { createPickupLocation } from '../ui/location';
import { tableizeBrands } from '../ui/brand';
import { tableizePackages } from '../ui/package';

export const command = 'env'
export const description = 'do stuff'

export const builder = (yargs: any): any =>
    yargs
        .command("foo", "do stuff", {}, async (context: { ds: DeliverySolutionsClient }) => {
            // const brands = await context.ds.brand.get()
            // tableizeBrands(brands)

            // const packages = await context.ds.package.get()
            // tableizePackages(packages)

            // const address = await createAddress()
            // console.log(address)
        })
        .help();