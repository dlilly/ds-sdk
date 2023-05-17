import { Dimension } from "./common"

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
    itemAttributes?: any
}

export { OrderItem }