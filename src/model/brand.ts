/*
    https://docs.deliverysolutions.co/reference/brands (no page under model?)
*/

import { Address } from "./address"

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
 * there are two undocumented fields in the payload returned from get brand details:
 * 
 * brandLogo
 * isDeleted
 * 
 */
class Brand {
    name: string
    address: Address

    _id: string = ''
    brandExternalId: string = ''
    description: string = ''
    currencyCode: string = ''
    active: boolean = false
    tenantId: string = ''
    atRisk?: AtRisk
    pickupInstructions: string = ''
    isDefault: boolean = false
    createdAt: string = ''
    lastUpdatedAt: string = ''

    constructor(input: { name: string, address: Address }) {
        this.name = input.name
        this.address = input.address
    }
}

/* i don't really see any documentation around AtRisk */
class AtRisk {
    isCorporateAtRisk!: boolean
    pickupStart!: number
    dropoffEnd!: number
}

export { Brand, AtRisk }