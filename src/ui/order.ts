import chalk from "chalk"
import Table from "cli-table"
import { Order } from "../model/order"
import { addressToString } from "./address"

const tableizeOrders = (orders: Order[]) => {
    const table = new Table({
        head: ['id','status'],
        colWidths: [30, 20]
    })

    orders.forEach(order => {
        table.push([order.orderExternalId, order.status])
    })

    console.log(table.toString())
}

export { tableizeOrders }