/*
    https://docs.deliverysolutions.co/reference/rate-1
*/

type Rate = {
    // delivery service provider
    provider: string

    // flag that specifies whether provider gives estimates
    noEstimate: boolean

    // is winning estimate or not, only if allowOrchestration is true
    ruleApplied: boolean

    // ISO-4217 currency code
    currencyCode: string

    // estimated amount the provider will charge
    amount: number

    // fee to be charged to the customer
    fee: number

    // minor unit of currency, eg, 'cents'
    currency: string

    // when will this estimate expire?
    expires?: string

    // requested pickup time
    requestedPickupTime?: number
    requestedPickupTimeEnds?: number

    // requested dropoff time
    requestedDropoffTime?: number
    requestedDropoffTimeEnds?: number

    // estimated pickup time
    estimatedPickupTime?: number
    estimatedPickupTimeEnds?: number

    // estimated delivery time
    estimatedDeliveryTime?: string
    estimatedDeliveryTimeStarts?: string
    estimatedDeliveryTimeEnds?: string

    // service type eg curbside, in-store pickup, etc
    type: string

    // provider service type
    serviceType: string

    // provider service id
    serviceId: string

    // pickup location
    storeExternalId: string

    // does the given provider support alternate location?
    supportsAlternateLocation: boolean

    // corresponding matched tags from the DSP
    tags: string[]
}

export { Rate }