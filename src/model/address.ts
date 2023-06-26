/* 
    https://docs.deliverysolutions.co/reference/address
*/

type Address = {
    street: string
    city: string
    state: string
    zipcode: string

    street2?: string
    apartmentNumber?: string
    country?: string
    latitude?: string
    longitude?: string
}

export { Address }