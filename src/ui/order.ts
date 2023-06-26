import chalk from "chalk"
import Table from "cli-table"
import { Order } from "../model/order"
import { addressToString } from "./address"

const tableizeOrders = (orders: Order[]) => {
    const table = new Table({
        head: ['id','status','dsp','etd'],
        colWidths: [20, 20, 20, 40]
    })

    orders.forEach(order => {
        const d = new Date()
        d.setTime((order as any).estimatedDeliveryTime)
        table.push([order.orderExternalId, order.status, (order as any).provider, d.toUTCString()])
    })

    console.log(table.toString())
}

export { tableizeOrders }