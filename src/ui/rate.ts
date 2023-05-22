import Table from "cli-table"
import { Rate } from "../model/rate"

const tableizeRates = (rates: Rate[]) => {
    const table = new Table({
        head: ['dsp', 'amount', 'est delivery'],
        colWidths: [30, 20, 40]
    })

    rates.forEach(rate => {
        let amount = '--'
        if (rate.amount) {
            if (rate.currencyCode === 'USD') {
                amount = `$${parseInt(rate.amount) / 100}`
            }
        }

        let deliveryTime = '--'
        if (rate.estimatedDeliveryTime) {
            deliveryTime = new Date(rate.estimatedDeliveryTime).toUTCString()
        }

        table.push([`${rate.provider}`, `${amount}`, `${deliveryTime}`])
    })

    console.log(table.toString())
}

export { tableizeRates }