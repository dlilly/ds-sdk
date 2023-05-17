const { AutoComplete, Form, Confirm } = require('enquirer')

import { DeliverySolutionsClient } from "../ds-client"
import { validateIsPositive } from "../helpers/input"
import { Dimension } from "./common"
import { OrderItem } from "./orderitem"
import chalk from "chalk"

class Package {
    _id?: string // if _id is part of the data model, it should be reflected on the models page, see below
    packageExternalId!: string // this field is not reflected on the models page for Package: https://docs.deliverysolutions.co/reference/package

    name!: string
    items?: number = 1

    quantity?: number
    description?: string
    size?: Dimension
    weight?: number
    itemList?: OrderItem[]
}

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
            { name: 'name', message: 'package name', initial: pkg?.name },
            { name: 'packageExternalId', message: 'package external id', initial: pkg?.packageExternalId },
            { name: 'weight', message: 'weight (lb)', initial: `${pkg?.weight}` },
            { name: 'height', message: 'height (in)', initial: `${pkg?.size?.height}` },
            { name: 'width', message: 'width (in)', initial: `${pkg?.size?.width}` },
            { name: 'length', message: 'length (in)', initial: `${pkg?.size?.length}` }
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

const selectPackage = async (context: { ds: DeliverySolutionsClient, pkg?: Package }): Promise<Package> => {
    if (context.pkg) { 
        return context.pkg
    }
    return await context.ds.selectPackage()
}

export { Package, editPackage, selectPackage }