const { AutoComplete, Confirm, Input } = require('enquirer')
import { Package } from "../model/datamodel";
import { DeliverySolutionsClient } from "../ds-client";
import chalk from 'chalk';

const validateIsPositive = (input: string) => {
    const num = parseFloat(input)
    if (isNaN(parseFloat(input))) {
        return `invalid value ${input}`
    }
    else if (num <= 0) {
        return `invalid value, must be positive`
    }
    return true
}

const inputPositiveInteger = (message: string) => (new Input({ message, validate: validateIsPositive, result: parseFloat })).run()

const buildPackage = async (): Promise<Package> => ({
    name: await (new Input({ message: 'package name' })).run(),
    packageExternalId: await (new Input({ message: 'package external id' })).run(),
    weight: await inputPositiveInteger('weight (lb)'),
    size: {
        height: await inputPositiveInteger('height (in)'),
        width: await inputPositiveInteger('width (in)'),
        length: await inputPositiveInteger('length (in)')
    }
})

const selectPackage = async (ds: DeliverySolutionsClient): Promise<Package | undefined> => {
    const packages = await ds.getPackages()
    const packageName = await (new AutoComplete({
        name: 'package',
        message: `select a package`,
        limit: packages.length,
        multiple: false,
        choices: packages.map(p => p.name)
    })).run()
    return packages.find(pkg => pkg.name === packageName)
}

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