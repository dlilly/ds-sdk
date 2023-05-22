import { input } from "@inquirer/prompts"
import chalk from "chalk"
import { Address } from "../model/address"

const addressToString = (address: Address): string => {
    return `${address.street}\n${address.city}, ${address.state}\n${address.zipcode} ${address.country || ''}`
}

const addressQuestionnaire = async (): Promise<Address> => ({
    street: await input({ message: 'street' }),
    street2: await input({ message: `street 2 ${(chalk.green(`[ optional ]`))}` }),
    apartmentNumber: await input({ message: 'apartment number [ optional ]' }),
    city: await input({ message: 'city' }),
    state: await input({ message: 'state' }),
    country: await input({ message: 'country [ optional ]' }),
    zipcode: await input({ message: 'zip code' }),
})

export { addressQuestionnaire, addressToString }