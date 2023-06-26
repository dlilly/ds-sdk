import chalk from 'chalk'

import { DeliverySolutionsClient } from '../ds/client'
import { PickupLocation } from '../model/location'
import { editPickupLocation, selectLocation, tableizeLocations } from '../ui/location'
import { filterInactive, showInactiveBuilder } from '../helpers/ds-middleware'
import { ReturnMethod } from '../model/returns'
import Table from 'cli-table'
import chalkTable from 'chalk-table'

export const command = 'returns'
export const description = 'manage returns'

const tableizeReturnMethods = (methods: ReturnMethod[]) => {
    const table = new Table({
        head: ['type', 'name/description'],
        colWidths: [25, 80],
        rows: methods.map(m => ([m.type, `${m.name}\n${m.description}`]))
    })
    console.log(table.toString())
}

export const builder = (yargs: any): any =>
    yargs
        .command("methods list", "list available return methods", {}, async function (context: { ds: DeliverySolutionsClient }) {
            const methods = await context.ds.returns.methods.list()
            tableizeReturnMethods(methods)
        })
        // .command("edit [storeExternalId]", "edit a location", {}, async function (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) {
        //     context.location = context.location || await selectLocation(context)
        //     const updated = await context.ds.location.update(await editPickupLocation(context))
        //     tableizeLocations([updated])
        //     console.log(`${chalk.greenBright('success')} updated location ${updated.storeExternalId}`)
        // })
        // .command("get [storeExternalId]", "get a location by storeExternalId", {}, async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }) => {
        //     tableizeLocations([await selectLocation(context)])
        // })
        // .command("list", "list locations", showInactiveBuilder, async (context: { ds: DeliverySolutionsClient, showInactive?: boolean }) => {
        //     tableizeLocations(filterInactive(await context.ds.location.get(), context))
        // })
        .help();