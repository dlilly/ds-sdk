/*
    https://docs.deliverysolutions.co/reference/item-order
*/

import { Dimension } from "./common"

type OrderItem = {
    sku: string

    upc?: string
    quantity?: number
    size?: Dimension
    weight?: number
    price?: number
    sale_price?: number
    image?: string
    title?: string
    description?: string
    itemAttributes?: any
}

export { OrderItem }