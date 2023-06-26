import chalk from "chalk"
import Table from "cli-table"
import { DeliveryAssuranceResult } from "../ds/da-payload"
import { PickupLocation } from "../model/location"

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

    if (result['store-boundary']) {
        table.push([chalk.blueBright('store-boundary'), mapStoreExternalIdsToStoreNames(result["store-boundary"].value, locations).join('\n'), JSON.stringify(result["store-boundary"].errors || [], undefined, 4)])
    }

    if (result['store-boundary-dsp']) {
        table.push([chalk.blueBright('store-boundary-dsp'), mapStoreExternalIdsToStoreNames(result["store-boundary-dsp"].value, locations).join('\n'), JSON.stringify(result["store-boundary-dsp"].errors || [], undefined, 4)])
    }

    console.log(table.toString())
}

export { tableizeDeliveryAssuranceResult }