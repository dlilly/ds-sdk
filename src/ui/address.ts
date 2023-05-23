import { Address } from "../model/address"

const addressToString = (address: Address): string => {
    return `${address.street}\n${address.city}, ${address.state}\n${address.zipcode} ${address.country || ''}`
}

const addressPrompts = (address?: Partial<Address>) => [
    { name: 'street', message: `street address`, initial: address?.street || '' },
    { name: 'street2', message: 'street address (cont)', initial: address?.street2 || '' },
    { name: 'apartmentNumber', message: 'apt/unit/ste #', initial: address?.apartmentNumber || '' },
    { name: 'city', message: 'city', initial: address?.city || '' },
    { name: 'state', message: 'state', initial: address?.state || '' },
    { name: 'country', message: 'country', initial: address?.country || '' },
    { name: 'zipcode', message: 'zipcode', initial: address?.zipcode || '' },
    { name: 'latitude', message: 'latitude', initial: address?.latitude || '' },
    { name: 'longitude', message: 'longitude', initial: address?.longitude || '' },
]

const validateAddress = (input: Address) => {
    return input.street.length === 0 && 'street address is required' ||
        input.city.length === 0 && 'city is required' ||
        input.state.length === 0 && 'state is required' ||
        input.zipcode.length === 0 && 'zipcode is required'
}

export { addressToString, addressPrompts, validateAddress }