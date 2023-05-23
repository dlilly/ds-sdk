import { DeliverySolutionsClient } from "../ds/client"
import { addressPrompts, addressToString, validateAddress } from "../ui/address"
import { Brand } from "../model/brand"
import Table from "cli-table"
import chalk from "chalk"
import { AutoComplete, Form } from "../helpers/enquirer"

class BrandInput {
    name!: string
    street!: string
    city!: string
    state!: string
    zipcode!: string
}

const editBrand = async (context: { ds: DeliverySolutionsClient, brand?: Brand }): Promise<Brand> => {
    const brandForm = new Form({
        message: `${chalk.cyanBright('brand details')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
        choices: [
            { name: 'name', message: `name`, initial: context.brand?.name || '' },
            { name: 'brandExternalId', message: 'brand external id', initial: context.brand?.brandExternalId || '' },
            { name: 'description', message: 'description', initial: context.brand?.description || '' },
            { name: 'currencyCode', message: 'iso-4217 currency code', initial: context.brand?.currencyCode || '' },
            { role: 'separator' },
            ...addressPrompts(context.brand?.address)
        ],
        validate: (input: BrandInput) => {
            return input.name.length === 0 && 'name is required' ||
                validateAddress(input) ||
                true
        }
    })
    return await brandForm.run()
}

const selectBrand = async (context: { ds: DeliverySolutionsClient, brand?: Brand, filterActive?: boolean }): Promise<Brand> => {
    if (context.brand) {
        return context.brand
    }

    const brands = await context.ds.brand.get({ filterActive: context.filterActive || false })
    const selectedName = await (new AutoComplete({
        message: 'select a brand',
        choices: brands.map(brand => brand.name),
        multiple: false,
        limit: brands.length
    })).run()
    return brands.find(brand => brand.name === selectedName)!
}

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

export { editBrand, selectBrand, tableizeBrands }