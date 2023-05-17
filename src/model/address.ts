export class Address {
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

export class Contact {
    name!: string
    phone!: string
}