import { input } from "@inquirer/prompts";
import chalk from "chalk";

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

const addressQuestionnaire = async (): Promise<Address> => ({
    street: await input({ message: 'street' }),
    street2: await input({ message: `street 2 ${(chalk.green(`[ optional ]`))}` }),
    apartmentNumber: await input({ message: 'apartment number [ optional ]' }),
    city: await input({ message: 'city' }),
    state: await input({ message: 'state' }),
    country: await input({ message: 'country [ optional ]' }),
    zipcode: await input({ message: 'zip code' }),
})

export { Address, Contact, addressQuestionnaire }