import { Contact } from "../model/contact"

const contactToString = (contact: Contact): string => {
    return `${contact.name}\n${contact.phone}`
}

const contactPrompts = (contact?: Contact) => [
    { name: 'name', message: `contact name`, initial: contact?.name || '' },
    { name: 'phone', message: 'contact phone #', initial: contact?.phone || '' }
]

const validateContact = (input: Partial<Contact>) => {
    return input.name?.length === 0 && 'contact name is required' ||
        input.phone?.length === 0 && 'contact phone is required'
}

export { contactToString, contactPrompts, validateContact }