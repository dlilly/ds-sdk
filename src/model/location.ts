import { DeliverySolutionsClient } from "../ds-client"
import { Address, Contact } from "./address"

class PickupLocation {
    _id!: string
    name!: string
    storeExternalId!: string
    address!: Address
    contact!: Contact
}

const buildPickupLocation = async(ds: DeliverySolutionsClient) => {
}

export { PickupLocation, buildPickupLocation }