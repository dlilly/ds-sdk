import { input, select } from "@inquirer/prompts"
import { Address, addressQuestionnaire } from "./address"
import { DeliverySolutionsClient } from "../ds-client"

/* 
    there does not appear to be a corresponding model page for Brand, was trying to figure out what an AtRisk is
*/
class Brand {
    name!: string
    address!: Address

    _id?: string
    brandExternalId?: string
    description?: string
    currencyCode?: string
    active?: boolean
    tenantId?: string
    atRisk?: AtRisk
    pickupInstructions?: string
    isDefault?: boolean
    createdAt?: string
    lastUpdatedAt?: string
}

/* i don't really see any documentation around AtRisk */
class AtRisk {
    isCorporateAtRisk!: boolean
    pickupStart!: number
    dropoffEnd!: number
}

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

export { Brand, AtRisk, brandQuestionnaire, selectBrand }