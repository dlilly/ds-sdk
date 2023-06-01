import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds/client'
import { PickupLocation } from '../model/location'
import { Form, Input, MultiSelect, Select } from '../helpers/enquirer'
import { addressPrompts, addressToString, validateAddress } from '../ui/address'
import async from 'async'
import { Address } from '../model/address'
import { DeliveryAssuranceResult } from '../ds/da-payload'
import Table from 'cli-table'

export const command = 'da'
export const description = 'delivery assurance'

const mapStoreExternalIdsToStoreNames = (ids: string[], locations: PickupLocation[]): string[] => {
    return ids.map(id => locations.find(loc => loc.storeExternalId === id)).map(l => l?.name || '??')
}

const tableizeDeliveryAssuranceResult = (result: DeliveryAssuranceResult, locations: PickupLocation[]) => {
    const table = new Table({
        head: ['service', 'dsp/store', 'errors'],
        colWidths: [25, 25, 50]
    })

    if (result.dsp) {
        table.push([chalk.blueBright('dsp'), result.dsp.value.join('\n'), JSON.stringify(result.dsp.errors || [], undefined, 4)])
    }

    if (result.storeBoundary) {
        table.push([chalk.blueBright('store-boundary'), mapStoreExternalIdsToStoreNames(result.storeBoundary.value, locations).join('\n'), JSON.stringify(result.storeBoundary.errors || [], undefined, 4)])
    }

    if (result.storeBoundaryDsp) {
        table.push([chalk.blueBright('store-boundary-dsp'), mapStoreExternalIdsToStoreNames(result.storeBoundaryDsp.value, locations).join('\n'), JSON.stringify(result.storeBoundaryDsp.errors || [], undefined, 4)])
    }

    console.log(table.toString())
}

const options = (yargs: any): any =>
    yargs
        .option('l', {
            alias: 'pickup-location',
            describe: 'pickup location id'
        })
        .option('z', {
            alias: 'zipcode',
            describe: 'delivery zipcode',
            type: 'string'
        })
        .option('a', {
            alias: 'all-services',
            describe: 'query all services',
            type: 'boolean'
        })
        .option('s', {
            alias: 'services',
            describe: 'services',
            type: 'array'
        })
        .conflicts('a', 's')

const servicesEnum = ["dsp", "store-boundary", "store-boundary-dsp"]
export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, pickupLocation?: string, location?: PickupLocation, allServices?: boolean, services?: string[] }, y: any) => {
            if (context.allServices) {
                context.services = servicesEnum
            }

            if (context.pickupLocation) {
                try {
                    context.location = await context.ds.location.getOne(context.pickupLocation)
                } catch (error) {
                    throw new Error(`${chalk.redBright('error')} location ${chalk.green(context.pickupLocation)} not found`)
                }
            }
        })
        .command("check", "check delivery assurance", options, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation, zipcode?: string, services?: string[] }) => {
            const locations = await context.ds.location.get()

            const deliveryAddress = context.zipcode ? context : await new Form({
                message: `${chalk.cyanBright('delivery address')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
                choices: addressPrompts(context),
                validate: (input: Address) => {
                    return input.zipcode.length === 0 && 'zipcode is required' ||
                        true
                }
            }).run()

            const services = context.services || await new MultiSelect({
                message: `select services (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)`,
                limit: servicesEnum.length,
                initial: context.services,
                choices: servicesEnum
            }).run()

            const pickupLocation = context.location || services.includes('dsp') && await new Select({
                message: `select pickup location (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)`,
                limit: locations.length,
                choices: locations.map(l => l.name),
                result: (input: any) => locations.find(loc => loc.name === input)
            }).run()

            const result = await context.ds.deliveryAssurance.check({
                deliveryAddress,
                services,
                storeExternalId: pickupLocation.storeExternalId
            })

            tableizeDeliveryAssuranceResult({
                ...result,
                storeBoundary: (result as any)['store-boundary'],
                storeBoundaryDsp: (result as any)['store-boundary-dsp']
            }, locations)
        })
        .help();