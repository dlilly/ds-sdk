const { AutoComplete, Form, Confirm } = require('enquirer')

import chalk from "chalk"
import Table from "cli-table"

import { DeliverySolutionsClient } from "../ds/client"
import { PickupLocation } from "../model/location"
import { addressPrompts, addressToString, validateAddress } from "./address"
import { contactPrompts, validateContact } from "./contact"

class PickupLocationInput {
  name!: string
  storeExternalId!: string
  brandExternalId!: string
  description?: string
  currencyCode?: string

  contactName!: string
  contactPhone!: string

  street!: string
  city!: string
  state!: string
  zipcode!: string
  street2?: string
  apartmentNumber?: string
  country?: string
  latitude?: string
  longitude?: string
}

const editPickupLocation = async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }): Promise<PickupLocation> => {
  const defaultBrand = await context.ds.brand.getDefault()
  const business = await context.ds.business.get()
  return await new Form({
    message: `${chalk.cyanBright('location details')} (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.greenBright('↵')} to submit)`,
    choices: [
      { name: 'name', message: `name`, initial: context.location?.name || '' },
      { name: 'storeExternalId', message: 'store external id', initial: context.location?.storeExternalId || ''  },
      { name: 'brandExternalId', message: 'brand external id', initial: context.location?.brandExternalId || defaultBrand.brandExternalId },
      { name: 'description', message: 'description', initial: context.location?.description || '' },
      { name: 'currencyCode', message: 'iso-4217 currency code', initial: context.location?.currencyCode || business.currencyCode },
      { role: 'separator' },
      ...contactPrompts(context.location?.contact),
      { role: 'separator' },
      ...addressPrompts(context.location?.address)
    ],
    validate: (input: PickupLocationInput) => {
      return input.name.length === 0 && 'name is required' ||
        input.storeExternalId.length === 0 && 'store external id is required' ||
        validateContact(input) ||
        validateAddress(input) ||
        true
    },
    result: (input: PickupLocationInput): PickupLocation => ({
      name: input.name,
      storeExternalId: input.storeExternalId,
      brandExternalId: input.brandExternalId,
      description: input.description,
      currencyCode: input.currencyCode,
      address: {
        street: input.street,
        city: input.city,
        state: input.state,
        zipcode: input.zipcode,
        street2: input.street2,
        apartmentNumber: input.apartmentNumber,
        country: input.country,
        latitude: input.latitude?.length === 0 ? undefined : input.latitude,
        longitude: input.longitude?.length === 0 ? undefined : input.longitude
      },
      contact: {
        name: input.contactName,
        phone: input.contactPhone
      }
    })
  }).run()
}

const selectLocation = async (context: { ds: DeliverySolutionsClient, location?: PickupLocation }, multiple?: boolean): Promise<PickupLocation> => {
  if (context.location) {
    return context.location
  }

  const locations = await context.ds.location.get()
  const selectedName = await (new AutoComplete({
    message: multiple ? `select locations (${chalk.whiteBright('↑/↓/⇥')} to navigate, ${chalk.green('space')} to select, ${chalk.greenBright('↵')} to submit)` : 'select a location',
    choices: locations.map(l => l.name),
    multiple,
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

export { editPickupLocation, selectLocation, tableizeLocations }