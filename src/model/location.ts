import { DeliverySolutionsClient } from "../ds-client"
import { Address, Contact } from "./address"

class PickupLocation {
    _id!: string
    name!: string
    storeExternalId!: string
    address!: Address
    contact!: Contact
    timeZone!: string
    currencyCode!: string
    description!: string
    pickupInstructions!: string
    returnStoreId!: string
    dsps!: any[]
}

const buildPickupLocation = async(ds: DeliverySolutionsClient) => {
}

const selectLocation = async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }): Promise<PickupLocation> => context.location || await context.ds.selectPickupLocation()

export { PickupLocation, buildPickupLocation, selectLocation }