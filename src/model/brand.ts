/*
    https://docs.deliverysolutions.co/reference/brands (no page under model?)
*/

import { Address } from "./address"
import { Activatible, DeliverySolutionsBaseType } from "./common"

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

type Brand = DeliverySolutionsBaseType & Activatible & {
    name: string
    address: Address
    brandExternalId: string

    description?: string
    currencyCode?: string
    tenantId?: string
    atRisk?: AtRisk
    pickupInstructions?: string
    isDefault?: boolean
    createdAt?: string
    lastUpdatedAt?: string
}

type AtRisk = {
    isCorporateAtRisk: boolean
    pickupStart: number
    dropoffEnd: number
}

export { Brand, AtRisk }