class Address {
    street!: string;
    street2?: string;
    apartmentNumber?: string;
    city!: string;
    state!: string;
    zipcode!: string;
    country?: string;
    latitude?: string;
    longitude?: string;
}

class Contact {
    name!: string
    phone!: string
}

export { Address, Contact }