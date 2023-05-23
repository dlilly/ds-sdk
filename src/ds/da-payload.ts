import { Address } from "../model/address"

class DeliveryAssurancePayload {
    deliveryAddress!: Address
    services!: string[]
    storeExternalId!: string
}

class DeliveryAssuranceResult {
    dsp?: { value: string[], errors: Error[] }
    storeBoundary?: { value: string[], errors: Error[] }
    storeBoundaryDsp?: { value: string[], errors: Error[] }
}

export { DeliveryAssurancePayload, DeliveryAssuranceResult }