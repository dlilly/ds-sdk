class Rate {
    provider!: string
    currencyCode!: string
    currency!: string
    amount!: string
    estimatedDeliveryTime!: string
    estimatedDeliveryTimeEnds!: string
    noEstimate: boolean = false
}

export { Rate }