/*
    https://docs.deliverysolutions.co/reference/pickup-location
*/

import { Address } from "./address"
import { Contact } from "./contact"

class PickupLocation {
    _id!: string
    active: boolean = true
    name!: string
    storeExternalId!: string
    address!: Address
    contact!: Contact
    timeZone!: string
    currencyCode!: string
    description!: string
    pickupInstructions!: string
    returnStoreId!: string
    dspAttributes: any
    DSPs!: any[]
}

export { PickupLocation }