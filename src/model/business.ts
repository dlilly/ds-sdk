/*
    https://docs.deliverysolutions.co/reference/create-business
*/

import { Address } from "./address"

type Business = {
    corporateName: string
    tenantId: string

    // why is this contactName as opposed to contact on pickupLocation?
    contactName: string

    // business contact email
    email: string

    // business phone number
    contact: string

    // business address
    address: Address

    // currency code
    currencyCode: string
}

export { Business }