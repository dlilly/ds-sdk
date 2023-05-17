import { Address } from "./address"

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

class Dimension {
    height!: number
    width!: number
    length!: number
}

class OrderItem {
    sku!: string

    upc?: string
    quantity?: number
    size?: Dimension
    weight?: number
    price?: number
    sale_price?: number
    image?: string
    title?: string
    description?: string

    // deno-lint-ignore no-explicit-any
    itemAttributes?: any
}

class Package {
    _id?: string // if _id is part of the data model, it should be reflected on the models page, see below
    packageExternalId!: string // this field is not reflected on the models page for Package: https://docs.deliverysolutions.co/reference/package

    name!: string
    items?: number = 1

    quantity?: number
    description?: string
    size?: Dimension
    weight?: number
    itemList?: OrderItem[]
}

export { Address, Brand, Package, Dimension, OrderItem, AtRisk }
