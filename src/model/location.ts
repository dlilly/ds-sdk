/*
    https://docs.deliverysolutions.co/reference/pickup-location
*/

import { Address } from "./address"
import { Contact } from "./contact"

class PickupLocation {
    active?: boolean
    name!: string
    storeExternalId!: string
    brandExternalId!: string
    address!: Address
    contact!: Contact
    timeZone?: string
    currencyCode?: string
    description?: string
    pickupInstructions?: string
    returnStoreId?: string
    dspAttributes?: any
    DSPs?: any[]
}

export { PickupLocation }