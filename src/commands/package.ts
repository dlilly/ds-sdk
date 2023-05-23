const { Confirm } = require('enquirer')
import { Package } from "../model/package";
import { DeliverySolutionsClient } from "../ds/client";
import chalk from 'chalk';
import { selectPackage, editPackage, tableizePackages } from "../ui/package";

export const command = 'package'
export const description = 'manage packages'

export const builder = (yargs: any): any =>
    yargs
        .middleware(async (context: { ds: DeliverySolutionsClient, packageExternalId?: string, pkg?: Package }, y: any) => {
            if (context.packageExternalId) {
                try {
                    context.pkg = await context.ds.package.getOne(context.packageExternalId)
                } catch (error) {
                    throw new Error(`${chalk.redBright('error')} package ${chalk.green(context.packageExternalId)} not found`)
                }
            }
        })
        .command("list", "list packages", {}, async (context: { ds: DeliverySolutionsClient }) => {
            tableizePackages(await context.ds.package.get())
        })
        .command("get [packageExternalId]", "get package details", {}, async (context: { ds: DeliverySolutionsClient, pkg?: Package }) => {
            tableizePackages([await selectPackage(context)])
        })
        .command("update [packageExternalId]", "update package", {}, async (context: { ds: DeliverySolutionsClient, pkg?: Package }) => {
            const updated = await context.ds.package.update(await editPackage(await selectPackage(context)))
            tableizePackages([updated])
            console.log(`${chalk.greenBright('success')} updated package ${updated.packageExternalId}`)
        })
        .command("create", "create a package", {}, async function (context: { ds: DeliverySolutionsClient }) {
            const created = await context.ds.package.create(await editPackage())
            tableizePackages([created])
            console.log(`${chalk.greenBright('success')} created package ${created.packageExternalId}`)
        })
        .command("delete [packageExternalId]", "delete a package", {}, async function (context: { ds: DeliverySolutionsClient, packageExternalId?: string }) {
            const pkg = await selectPackage(context)
            if (await (new Confirm({ message: `delete package ${chalk.green(pkg.packageExternalId)}`, initial: true })).run()) {
                try {
                    const deleted = await context.ds.package.delete(pkg.packageExternalId)
                    tableizePackages([deleted])
                    console.log(`${chalk.greenBright('success')} package ${chalk.green(deleted.packageExternalId)} deleted`)
                } catch (error) {
                    console.error(`${chalk.red('error')} deleting package ${chalk.green(pkg.packageExternalId)}: ${error}`)
                }
            }
        })
        .help();