/*
    https://docs.deliverysolutions.co/reference/location-contact-1
*/

type Contact = {
    name: string
    phone: string
}

/*
    https://docs.deliverysolutions.co/reference/contact
*/

type DeliveryContact = Contact & {
    email: string
    customerId: string
    notifySms: boolean
    notifyEmail: boolean
}

export { Contact, DeliveryContact }