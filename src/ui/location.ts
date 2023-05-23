const { AutoComplete, Form, Confirm } = require('enquirer')

import chalk from "chalk"
import Table from "cli-table"

import { DeliverySolutionsClient } from "../ds-client"
import { PickupLocation } from "../model/location"
import { addressPrompts, addressToString, validateAddress } from "./address"
import { contactPrompts, validateContact } from "./contact"

class PickupLocationInput {
  name!: string
  street!: string
  city!: string
  state!: string
  zipcode!: string
  contactName!: string
  contactPhone!: string
}

const createPickupLocation = (): Promise<PickupLocation> => new Form({
  message: `location details (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
  choices: [
    { name: 'name', message: `name` },
    { name: 'storeExternalId', message: 'store external id' },
    { name: 'brandExternalId', message: 'brand external id' },
    { name: 'description', message: 'description' },
    { name: 'currencyCode', message: 'iso-4217 currency code' },
    { role: 'separator' },
    ...contactPrompts,
    { role: 'separator' },
    ...addressPrompts
  ],
  validate: (input: PickupLocationInput) => {
    return input.name.length === 0 && 'name is required' ||
      validateContact(input) ||
      validateAddress(input) ||
      true
  }
}).run()

const selectLocation = async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }): Promise<PickupLocation> => {
  if (context.location) {
    return context.location
  }

  const locations = await context.ds.location.get()
  const selectedName = await (new AutoComplete({
    message: 'select a location',
    choices: locations.map(l => l.name),
    multiple: false,
    limit: locations.length
  })).run()
  return locations.find(loc => loc.name === selectedName)!
}

const tableizeLocations = (locations: PickupLocation[]) => {
  const table = new Table({
    head: ['name\nstoreExternalId', 'contact', 'address', 'currency'],
    colWidths: [30, 20, 30, 10]
  })

  locations.forEach(loc => {
    table.push([`${loc.name}\n${chalk.cyan(loc.storeExternalId)}`, `${loc.contact.name}\n${loc.contact.phone}`, addressToString(loc.address), `${loc.currencyCode}`])
  })

  console.log(table.toString())
}

export { createPickupLocation, selectLocation, tableizeLocations }