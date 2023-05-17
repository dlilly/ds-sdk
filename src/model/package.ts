const { AutoComplete, Confirm, Input } = require('enquirer')

import { DeliverySolutionsClient } from "../ds-client"
import { inputPositiveFloat } from "../helpers/input"
import { Dimension } from "./common"
import { OrderItem } from "./orderitem"

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

const buildPackage = async (): Promise<Package> => ({
    name: await (new Input({ message: 'package name' })).run(),
    packageExternalId: await (new Input({ message: 'package external id' })).run(),
    weight: await inputPositiveFloat('weight (lb)'),
    size: {
        height: await inputPositiveFloat('height (in)'),
        width: await inputPositiveFloat('width (in)'),
        length: await inputPositiveFloat('length (in)')
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

export { Package, buildPackage, selectPackage }