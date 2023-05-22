import { Dimension } from "./common"
import { OrderItem } from "./orderitem"

/**
 * there are some discrepancies between the Package in listPackages, etc and the Package in Models
 * (eg, the one in Models is more like order-package)
 */

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

export { Package }