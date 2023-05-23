import Table from "cli-table"
import { Rate } from "../model/rate"

const tableizeRates = (rates: Rate[]) => {
    const table = new Table({
        head: ['dsp', 'amount', 'fee', 'est delivery'],
        colWidths: [30, 20, 20, 40]
    })

    rates.forEach(rate => {
        let amount = '--'
        if (rate.amount) {
            if (rate.currencyCode === 'USD') {
                amount = `$${rate.amount / 100}`
            }
        }

        let fee = '--'
        if (rate.fee) {
            if (rate.currencyCode === 'USD') {
                fee = `$${rate.fee / 100}`
            }
        }

        let deliveryTime = '--'
        if (rate.estimatedDeliveryTime) {
            deliveryTime = new Date(rate.estimatedDeliveryTime).toUTCString()
        }

        table.push([`${rate.provider}`, `${amount}`, `${fee}`, `${deliveryTime}`])
    })

    console.log(table.toString())
}

export { tableizeRates }