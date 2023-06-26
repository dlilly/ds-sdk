import { Brand } from '../model/brand'
import { DeliverySolutionsClient } from '../ds/client'

import chalk from 'chalk'
import { selectBrand, editBrand, tableizeBrands } from '../ui/brand'
import { filterInactive, showInactiveBuilder } from '../helpers/ds-middleware'

export const command = 'brand'
export const description = 'manage brands'

export const builder = (yargs: any): any =>
    yargs
        .command("create", "create a brand", {}, async function (context: { ds: DeliverySolutionsClient }) {
            tableizeBrands([await context.ds.brand.create(await editBrand(context))])
        })
        .command("get [brandExternalId]", "get a brand by its brandExternalId or select from a list", showInactiveBuilder, async (context: { ds: DeliverySolutionsClient }) => {
            tableizeBrands([await selectBrand(context)])
        })
        .command("list", "list brands", showInactiveBuilder, async (context: { ds: DeliverySolutionsClient, showInactive: boolean }) => {
            tableizeBrands(filterInactive(await context.ds.brand.get(), context))
        })
        .help();