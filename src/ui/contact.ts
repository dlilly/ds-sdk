import { Contact } from "../model/contact"

const contactToString = (contact: Contact): string => {
    return `${contact.name}\n${contact.phone}`
}

const contactPrompts = (contact?: Contact) => [
    { name: 'contactName', message: `contact name`, initial: contact?.name || '' },
    { name: 'contactPhone', message: 'contact phone #', initial: contact?.phone || '' }
]

class ContactInput {
    contactName!: string
    contactPhone!: string
}

const validateContact = (input: ContactInput) => {
    return input.contactName.length === 0 && 'contact name is required' ||
        input.contactPhone.length === 0 && 'contact phone is required'
}

export { contactToString, contactPrompts, validateContact }