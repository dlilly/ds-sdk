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
    description?: string = ''
    currencyCode?: string = ''
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

const selectBrand = async (context: { ds: DeliverySolutionsClient, brand?: Brand, filterActive?: boolean }): Promise<Brand> => context.brand || await context.ds.selectBrand(context)

export { Brand, AtRisk, brandQuestionnaire, selectBrand }