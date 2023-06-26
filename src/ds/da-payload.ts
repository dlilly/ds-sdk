import { Address } from "../model/address"

type DSPResult = {
    value: string[]
    errors: Error[]
}

type DeliveryAssurancePayload = {
    deliveryAddress: Partial<Address>
    services: string[]
    storeExternalId: string
}

type DeliveryAssuranceResult = {
    dsp?: DSPResult
    'store-boundary'?: DSPResult
    'store-boundary-dsp'?: DSPResult
}

export { DeliveryAssurancePayload, DeliveryAssuranceResult }