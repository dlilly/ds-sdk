import { Address } from "./address"
import { DeliveryNotification, TimeWindow } from "./common"
import { Contact, DeliveryContact } from "./contact"
import { OrderItem } from "./orderitem"
import { OrderStatus } from "./orderstatus"
import { DeliveryPackage, Package, TemperatureControl } from "./package"

type OrderType = '' | 'delivery' | 'in-store-pickup' | 'curbside' | 'shipping'
type DispatchType = 'immediate' | 'scheduled' | 'manual'
type DispatchTimeBasedOn = 'pickupTimeStartsAt' | 'dropoffTimeEndsAt'
type SignatureRequirement = 'not_required' | 'required' | 'unattended' | 'required_recipient'

type OrderInput = Partial<Order> & Pick<Order, 'storeExternalId' | 'orderExternalId' | 'orderValue' | 'deliveryAddress' | 'deliveryContact'>

type ProposedProvider = {
    name: string
    services: string[]
}

type OrderDispatch = {
    type: DispatchType
    time?: number
    basedOn?: DispatchTimeBasedOn
}

type AlternateLocation = {
    name: string
    provider: string

    type?: string
    phone?: string
    address?: Address
    dspLocationId?: string
    locationTimings?: string[]
}

type Order = {
    storeExternalId: string
    orderExternalId: string
    orderValue: number
    deliveryContact: DeliveryContact
    deliveryAddress: Address

    type: OrderType
    packages: DeliveryPackage[]

    isSpirit: boolean
    isBeerOrWine: boolean
    isTobacco: boolean
    isFragile: boolean
    isRx: boolean
    hasRefrigeratedItems: boolean
    hasPerishableItems: boolean

    orderAttributes: { [key: string]: string }
    itemList: OrderItem[]

    temperatureControl?: TemperatureControl
    barcodes?: string[]

    // optionals
    groupId?: string
    tips?: number
    pickupTime?: TimeWindow
    dropoffTime?: TimeWindow

    notification?: DeliveryNotification
    signature?: SignatureRequirement
    pickupInstructions?: string
    deliveryInstructions?: string

    alternateLocation?: AlternateLocation

    proposedProviders?: ProposedProvider[]
    dispatch?: OrderDispatch

    status: OrderStatus
}

export { Order, OrderInput, OrderType, DispatchType }