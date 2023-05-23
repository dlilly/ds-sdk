/*
    https://docs.deliverysolutions.co/reference/location-contact-1
*/

class Contact {
    name!: string
    phone!: string
}

/*
    https://docs.deliverysolutions.co/reference/contact
*/

class OrderContact extends Contact {
    email: string = ''
    customerId: string = ''
    notifySms: boolean = false
    notifyEmail: boolean = false
}

export { Contact, OrderContact }