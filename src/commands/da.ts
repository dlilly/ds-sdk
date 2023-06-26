import chalk from 'chalk'
import { DeliverySolutionsClient } from '../ds/client';
import { PickupLocation } from '../model/location';
import { promptForAddress, promptForPickupLocation, promptForServices } from '../ui/address';
import { tableizeDeliveryAssuranceResult } from '../ui/da';

export const command = 'da'
export const description = 'delivery assurance'

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

export const builder = (yargs: any): any =>
    yargs
        .command("check", "check delivery assurance", options, async (context: { ds: DeliverySolutionsClient, allServices?: boolean, zipcode?: string, services?: string[] }) => {
            const deliveryAddress = await promptForAddress(context)
            const services = await promptForServices(context)
            const pickupLocation = await promptForPickupLocation(context, services)

            const result = await context.ds.deliveryAssurance.check({
                ...pickupLocation,
                deliveryAddress,
                services
            })
            tableizeDeliveryAssuranceResult(result, await context.ds.location.get())
        })
        .help();