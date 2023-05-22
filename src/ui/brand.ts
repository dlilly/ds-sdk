import { input } from "@inquirer/prompts"
import { DeliverySolutionsClient } from "../ds-client"
import { addressQuestionnaire, addressToString } from "../ui/address"
import { Brand } from "../model/brand"
import Table from "cli-table"
import chalk from "chalk"

const brandQuestionnaire = async (): Promise<Brand> => new Brand({
    name: await input({ message: 'name' }),
    address: await addressQuestionnaire()
})

const selectBrand = async (context: { ds: DeliverySolutionsClient, brand?: Brand, filterActive?: boolean }): Promise<Brand> => context.brand || await context.ds.selectBrand(context)

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

export { brandQuestionnaire, selectBrand, tableizeBrands }