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

class ProposedProvider {
    name!: string
    services: string[] = []
}

class OrderDispatch {
    type!: DispatchType
    time?: number
    basedOn?: DispatchTimeBasedOn
}

class AlternateLocation {
    name!: string
    type?: string
    phone?: string
    provider!: string
    address?: Address
    dspLocationId?: string
    locationTimings?: string[] = []
}

class Order {
    storeExternalId!: string
    orderExternalId!: string
    orderValue!: number
    deliveryContact!: DeliveryContact
    deliveryAddress!: Address

    type: OrderType = ''
    packages: DeliveryPackage[] = []

    isSpirit: boolean = false
    isBeerOrWine: boolean = false
    isTobacco: boolean = false
    isFragile: boolean = false
    isRx: boolean = false
    hasRefrigeratedItems: boolean = false
    hasPerishableItems: boolean = false

    orderAttributes: { [key: string]: string } = {}
    itemList: OrderItem[] = []

    temperatureControl?: TemperatureControl = ''
    barcodes?: string[] = []

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

    status!: OrderStatus
}

export { Order, OrderInput }