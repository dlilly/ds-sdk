const { Confirm } = require('enquirer')
import { Package, editPackage, selectPackage } from "../model/package";
import { DeliverySolutionsClient } from "../ds-client";
import chalk from 'chalk';

export const command = 'package'
export const description = 'manage packages'

/**
 * there are five api calls exposed for packages:
 * 
 * list packages (GET /api/v2/package)
 * create package (POST /api/v2/package)
 * get package details (GET /api/v2/package/getById/packageExternalId/<packageExternalId>)
 * update package (POST /api/v2/package/packageExternalId/<packageExternalId>)
 * delete package (DELETE /api/v2/package/packageExternalId/<packageExternalId>)
 */

export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, packageExternalId?: string, pkg?: Package }, y: any) => {
            if (context.packageExternalId) {
                try {
                    context.pkg = await context.ds.getPackage(context.packageExternalId)
                } catch (error) {
                    throw new Error(`${chalk.redBright('error')} package ${chalk.green(context.packageExternalId)} not found`)
                }
            }
        })
        .command("list", "list packages", {}, async (context: { ds: DeliverySolutionsClient }) => {
            console.log((await context.ds.getPackages()).map(pkg => pkg.packageExternalId))
        })
        .command("get [packageExternalId]", "get package details", {}, async (context: { ds: DeliverySolutionsClient, pkg?: Package }) => {
            console.log(await selectPackage(context))
        })
        .command("update [packageExternalId]", "update package", {}, async (context: { ds: DeliverySolutionsClient, pkg?: Package }) => {
            const updated = await context.ds.upsertPackage(await editPackage(await selectPackage(context)))
            console.log(`${chalk.greenBright('success')} updated package ${updated.packageExternalId}`)
        })
        .command("create", "create a package", {}, async function (context: { ds: DeliverySolutionsClient }) {
            const created = await context.ds.upsertPackage(await editPackage())
            console.log(`${chalk.greenBright('success')} updated package ${created.packageExternalId}`)
        })
        .command("delete [packageExternalId]", "delete a package", {}, async function (context: { ds: DeliverySolutionsClient, packageExternalId?: string }) {
            const pkg = await selectPackage(context)
            if (await (new Confirm({ message: `delete package ${chalk.green(pkg.packageExternalId)}`, initial: true })).run()) {
                try {
                    const deleted = await context.ds.deletePackage(pkg.packageExternalId)
                    console.log(`${chalk.greenBright('success')} package ${chalk.green(deleted.packageExternalId)} deleted`)
                } catch (error) {
                    console.error(`${chalk.red('error')} deleting package ${chalk.green(pkg.packageExternalId)}: ${error}`)
                }
            }
        })
        .help();