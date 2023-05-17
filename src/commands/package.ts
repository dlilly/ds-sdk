const { AutoComplete, Confirm, Input } = require('enquirer')
import { buildPackage, selectPackage } from "../model/package";
import { DeliverySolutionsClient } from "../ds-client";
import chalk from 'chalk';

export const command = 'package'
export const description = 'manage packages'

export const builder = (yargs: any): any =>
    yargs
        .command("list", "list packages", {}, async (context: { ds: DeliverySolutionsClient }) => {
            console.log((await context.ds.getPackages()).map(pkg => pkg.packageExternalId))
        })
        .command("get [packageExternalId]", "get a package by its packageExternalId", {}, async (context: { ds: DeliverySolutionsClient, packageExternalId?: string }) => {
            console.log(context.packageExternalId ? await context.ds.getPackage(context.packageExternalId) : await selectPackage(context.ds))
        })
        .command("add", "add a package", {}, async function (context: { ds: DeliverySolutionsClient }) {
            console.log(await context.ds.createPackage(await buildPackage()))
        })
        .command("delete [packageExternalId]", "delete a package", {}, async function (context: { ds: DeliverySolutionsClient, packageExternalId?: string }) {
            const pkg = context.packageExternalId ? await context.ds.getPackage(context.packageExternalId) : await selectPackage(context.ds)
            if (pkg) {
                if (await (new Confirm({ message: `delete package ${chalk.green(pkg.packageExternalId)}`, initial: true })).run()) {
                    try {
                        const deleted = await context.ds.deletePackage(pkg.packageExternalId)
                        console.log(`success! package ${chalk.green(deleted.packageExternalId)} deleted`)
                    } catch (error) {
                        console.error(`${chalk.red('error')} deleting package ${chalk.green(pkg.packageExternalId)}: ${error}`)
                    }
                }
            }
            else {
                console.error(`${chalk.red('error:')} package not found`)
            }
        })
        .help();