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

class Package {
    // name of package or 'custom'
    name!: string

    // unique id that maps to package id in customer system
    packageExternalId!: string // this field is not reflected on the models page for Package: https://docs.deliverysolutions.co/reference/package

    size?: Dimension
    weight?: number
    description?: string
}

type TemperatureControl = 'none' | 'frozen' | 'refrigerated' | 'cool' | 'ambient' | 'warm' | ''

class DeliveryPackage extends Package {
    quantity!: number
    items: number = 1
    itemList: OrderItem[] = []
    temperatureControl: TemperatureControl = ''
    content!: Content
}

class Content {
    isSpirit:           boolean = false
    isBeerOrWine:       boolean = false
    isTobacco:          boolean = false
    isFragile:          boolean = false
    isRx:               boolean = false
    hasPerishableItems: boolean = false
}

export { Package, DeliveryPackage, TemperatureControl }