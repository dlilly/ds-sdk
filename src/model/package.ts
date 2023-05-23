/*
    https://docs.deliverysolutions.co/reference/package
*/

import { Dimension } from "./common"
import { OrderItem } from "./orderitem"

/**
 * there are some discrepancies between the Package in listPackages, etc and the Package in Models
 * (eg, the one in Models is more like order-package)
 */

class Package {
    // name of package or 'custom'
    name!: string

    // unique id that maps to package id in customer system
    packageExternalId!: string // this field is not reflected on the models page for Package: https://docs.deliverysolutions.co/reference/package

    // package size
    size?: Dimension

    // package weight in lb
    weight?: number
    
    // these need to move elsewhere
    description?: string
    quantity?: number
    items?: number = 1
    itemList?: OrderItem[]
}

export { Package }