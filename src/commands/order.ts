import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds/client'
import { PickupLocation } from '../model/location'
import { Form, Input, MultiSelect, Select } from '../helpers/enquirer'
import { addressPrompts, addressToString, validateAddress } from '../ui/address'
import async from 'async'
import { Address } from '../model/address'
import { DeliveryAssuranceResult } from '../ds/da-payload'
import Table from 'cli-table'
import { contactPrompts, validateContact } from '../ui/contact'
import { Order } from '../model/order'

import short from 'short-uuid'
import { validateIsPositive } from '../helpers/input'
import { tableizeOrders } from '../ui/order'
import { OrderStatus } from '../model/orderstatus'

export const command = 'order'
export const description = 'order management'

const orderTypeEnum = ['', 'delivery', 'in-store-pickup', 'curbside', 'shipping']
const dispatchTypeEnum = ['immediate', 'scheduled', 'manual']
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
        .option('o', {
            alias: 'orderExternalId',
            describe: 'order id',
            type: 'string'
        })

const selectOrder = async (context: { ds: DeliverySolutionsClient }): Promise<Order> => {
    const orders = await context.ds.order.get()
    const selectedOrderIds = await (new Select({
        message: `select order`,
        choices: orders.map(o => o.orderExternalId),
        limit: orders.length
    })).run()
    return orders.find(o => selectedOrderIds.includes(o.orderExternalId))!
}

const selectOrders = async (context: { ds: DeliverySolutionsClient }): Promise<Order[]> => {
    const orders = await context.ds.order.get()
    const selectedOrderIds = await (new Select({
        message: `select orders (${chalk.whiteBright('↑/↓')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)`,
        choices: orders.map(o => o.orderExternalId),
        multiple: true,
        limit: orders.length
    })).run()
    const selectedOrders = orders.filter(o => selectedOrderIds.includes(o.orderExternalId))
    return selectedOrders.length > 0 ? selectedOrders : await selectOrders(context)
}

export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, pickupLocation?: string, location?: PickupLocation, orderExternalId?: string, order?: Order }, y: any) => {
            if (context.pickupLocation) {
                try {
                    context.location = await context.ds.location.getOne(context.pickupLocation)
                } catch (error) {
                    throw `${chalk.red('error')} location ${chalk.cyanBright(context.pickupLocation)} not found`
                }
            }

            if (context.orderExternalId) {
                context.order = await context.ds.order.getOne(context.orderExternalId)
            }
        })
        .command("create", "create new order", options, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation, zipcode?: string }) => {
            const locations = await context.ds.location.get()
            const packages = await context.ds.package.get()

            const pickupLocation = context.location || await new Select({
                message: `pickup location (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
                limit: locations.length,
                choices: locations.map(l => l.name),
                result: (input: any) => locations.find(loc => loc.name === input)
            }).run()

            const order = await context.ds.order.create({
                storeExternalId: pickupLocation.storeExternalId,
                orderExternalId: `${pickupLocation.storeExternalId}-${short.generate().substring(0, 8)}`,
                orderValue: await new Input({ message: `order value`, validate: validateIsPositive, result: parseFloat }).run(),
                deliveryContact: await new Form({
                    message: `${chalk.cyanBright('delivery contact')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
                    choices: contactPrompts(),
                    validate: (contact: any) => validateContact(contact) || true
                }).run(),
                deliveryAddress: await new Form({
                    message: `${chalk.cyanBright('delivery address')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
                    choices: addressPrompts(context),
                    validate: (address: any) => validateAddress(address) || true
                }).run(),
                dispatch: {
                    type: await new Select({
                        message: `dispatch type`,
                        limit: dispatchTypeEnum.length,
                        choices: dispatchTypeEnum
                    }).run()
                },
                packages: [{
                    quantity: await new Input({
                        message: 'package quantity',
                        initial: 1,
                        validate: validateIsPositive,
                        result: parseInt
                    }).run(),
                    ...await new Select({
                        message: `package type (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
                        limit: packages.length,
                        choices: packages.map(p => p.name),
                        result: (input: any) => packages.find(p => p.name === input)
                    }).run()
                }]
            })

            console.log(JSON.stringify(order))
        })
        .command("generate", "")
        .command("list", "list orders", options, async (context: { ds: DeliverySolutionsClient }) => {
            tableizeOrders(await context.ds.order.get())
        })
        .command("history [orderExternalId]", "show order history", options, async (context: { ds: DeliverySolutionsClient, order?: Order }) => {
            console.log(context.order)
        })
        .command("status update", "update status", options, async (context: { ds: DeliverySolutionsClient }) => {
            const orders = await selectOrders(context)

            tableizeOrders(orders)

            const status = await (new Select({
                message: `select new order status`,
                choices: Object.values(OrderStatus),
                limit: Object.values(OrderStatus).length
            })).run()

            tableizeOrders(await Promise.all(orders.map((order: Order) => context.ds.order.updateStatus(order, status))))
        })
        .command("cancel", "cancel order(s)", options, async (context: { ds: DeliverySolutionsClient }) => {
            tableizeOrders(await Promise.all((await selectOrders(context)).map(context.ds.order.cancel)))
        })
        .help();