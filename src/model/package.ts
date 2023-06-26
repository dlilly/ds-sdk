/*
    https://docs.deliverysolutions.co/reference/package
*/

import { Dimension } from "./common"
import { OrderItem } from "./orderitem"

/**
 * there are five api calls exposed for packages:
 * 
 * list packages (GET /api/v2/package)
 * create package (POST /api/v2/package)
 * get package details (GET /api/v2/package/getById/packageExternalId/<packageExternalId>)
 * update package (POST /api/v2/package/packageExternalId/<packageExternalId>)
 * delete package (DELETE /api/v2/package/packageExternalId/<packageExternalId>)
 */

/**
 * there are some discrepancies between the Package in listPackages, etc and the Package in Models
 * (eg, the one in Models is more like order-package)
 */

type Package = {
    name: string

    // unique id that maps to package id in customer system
    packageExternalId: string

    size?: Dimension
    weight?: number
    description?: string
}

type TemperatureControl = 'none' | 'frozen' | 'refrigerated' | 'cool' | 'ambient' | 'warm' | ''

type DeliveryPackage = Package & {
    quantity: number
    items: number
    itemList: OrderItem[]
    temperatureControl: TemperatureControl
    content: Content
}

type Content = {
    isSpirit:           boolean
    isBeerOrWine:       boolean
    isTobacco:          boolean
    isFragile:          boolean
    isRx:               boolean
    hasPerishableItems: boolean
}

export { Package, DeliveryPackage, TemperatureControl }