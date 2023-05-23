import { Address } from "../model/address"

const addressToString = (address: Address): string => {
    return `${address.street}\n${address.city}, ${address.state}\n${address.zipcode} ${address.country || ''}`
}

const addressPrompts = [
    { name: 'street', message: `street address` },
    { name: 'street2', message: 'street address (cont)' },
    { name: 'apartmentNumber', message: 'apt/unit/ste #' },
    { name: 'city', message: 'city' },
    { name: 'state', message: 'state' },
    { name: 'country', message: 'country' },
    { name: 'zipcode', message: 'zipcode' },
    { name: 'latitude', message: 'latitude' },
    { name: 'longitude', message: 'longitude' },
]

const validateAddress = (input: Address) => {
    return input.street.length === 0 && 'street address is required' ||
        input.city.length === 0 && 'city is required' ||
        input.state.length === 0 && 'state is required' ||
        input.zipcode.length === 0 && 'zipcode is required' ||
        true
}

export { addressToString, addressPrompts, validateAddress }