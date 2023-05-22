const { AutoComplete, Form, Confirm } = require('enquirer')

import chalk from "chalk"
import { DeliverySolutionsClient } from "../ds-client"
import { validateIsPositive } from "../helpers/input"
import { Package } from "../model/package"
import Table from "cli-table"

class PackageInput {
    name!: string
    packageExternalId!: string
    weight!: string
    height!: string
    width!: string
    length!: string
}

const editPackage = (pkg?: Package): Promise<Package> => new Form({
    message: `package details (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
    choices: [
        { name: 'name', message: 'package name', initial: pkg?.name || '' },
        { name: 'packageExternalId', message: 'package external id', initial: pkg?.packageExternalId || '' },
        { name: 'weight', message: 'weight (lb)', initial: `${pkg?.weight || ''}` },
        { name: 'height', message: 'height (in)', initial: `${pkg?.size?.height || ''}` },
        { name: 'width', message: 'width (in)', initial: `${pkg?.size?.width || ''}` },
        { name: 'length', message: 'length (in)', initial: `${pkg?.size?.length || ''}` }
    ],
    validate: (input: PackageInput) => {
        return input.name.length === 0 && 'package name is required' ||
            input.packageExternalId.length === 0 && 'package external id is required' ||
            !validateIsPositive(input.weight) && 'weight must be > 0' ||
            !validateIsPositive(input.height) && 'height must be > 0' ||
            !validateIsPositive(input.width) && 'width must be > 0' ||
            !validateIsPositive(input.length) && 'length must be > 0' ||
            pkg?.packageExternalId && pkg?.packageExternalId !== input.packageExternalId && 'cannot change package external id' ||
            true
    },
    result: (input: PackageInput): Package => ({
        _id: pkg?._id,
        name: input.name,
        packageExternalId: input.packageExternalId,
        weight: parseFloat(input.weight),
        size: {
            height: parseFloat(input.height),
            width: parseFloat(input.width),
            length: parseFloat(input.length),
        }
    })
}).run()

const selectPackage = async (context: { ds: DeliverySolutionsClient, pkg?: Package }): Promise<Package> => context.pkg || await context.ds.selectPackage()

const tableizePackages = (packages: Package[]) => {
    const table = new Table({
        head: ['name\npackageExternalId','weight\n(lb)','height\n(in)','width\n(in)','length\n(in)'],
        colWidths: [30, 10, 10, 10, 10]
    })

    packages.forEach(pkg => {
        table.push([`${pkg.name}\n${chalk.cyan(pkg.packageExternalId)}`, `${pkg.weight}`, `${pkg.size?.height}`, `${pkg.size?.width}`, `${pkg.size?.length}`])
    })

    console.log(table.toString())
}

export { editPackage, selectPackage, tableizePackages }