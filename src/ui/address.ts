import { Form, MultiSelect, Select } from "../helpers/enquirer"
import { Address } from "../model/address"
import chalk from "chalk"
import { PickupLocation } from "../model/location"
import { DeliverySolutionsClient } from "../ds/client"

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

const promptForAddress = async (context: { zipcode?: string }): Promise<Address> => {
    return context.zipcode ? context : await new Form({
        message: `${chalk.cyanBright('delivery address')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
        choices: addressPrompts(context),
        validate: (input: Address) => {
            return input.zipcode.length === 0 && 'zipcode is required' ||
                true
        }
    }).run()
}

const DSDeliveryServices = ["dsp", "store-boundary", "store-boundary-dsp"]
const promptForServices = async (context: { allServices?: boolean, services?: string[] }): Promise<string[]> => {
    return context.allServices ? DSDeliveryServices : context.services || await new MultiSelect({
        message: `select services (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)`,
        limit: DSDeliveryServices.length,
        initial: context.services,
        choices: DSDeliveryServices
    }).run()
}

const promptForPickupLocation = async (context: { ds: DeliverySolutionsClient, pickupLocation?: string }, services: string[]): Promise<PickupLocation> => {
    if (context.pickupLocation) {
        try {
            return await context.ds.location.getOne(context.pickupLocation)
        } catch (error) {
            throw `${chalk.redBright('error')} location ${chalk.green(context.pickupLocation)} not found`
        }
    }

    const locations = await context.ds.location.get()
    return services.includes('dsp') && await new Select({
        message: `select pickup location (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)`,
        limit: locations.length,
        choices: locations.map(l => l.name),
        result: (input: any) => locations.find(loc => loc.name === input)
    }).run()
}

export { addressToString, addressPrompts, validateAddress, promptForAddress, promptForServices, promptForPickupLocation, DSDeliveryServices }