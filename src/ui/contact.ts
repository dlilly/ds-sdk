import { Contact } from "../model/contact"

const contactToString = (contact: Contact): string => {
    return `${contact.name}\n${contact.phone}`
}

const contactPrompts = [
    { name: 'contactName', message: `contact name` },
    { name: 'contactPhone', message: 'contact phone #' }
]

class ContactInput {
    contactName!: string
    contactPhone!: string
}

const validateContact = (input: ContactInput) => {
    return input.contactName.length === 0 && 'contact name is required' ||
        input.contactPhone.length === 0 && 'contact phone is required' ||
        true
}

export { contactToString, contactPrompts, validateContact }