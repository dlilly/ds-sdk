import chalk from "chalk"
import Table from "cli-table"
import { AddressBoundary, Boundary, CircleBoundary, ZipBoundary } from "../model/boundary"

const tableizeBoundaries = (boundaries: Boundary[]) => {
    const table = new Table({
        head: ['name\nlocation\nshape','details'],
        colWidths: [30, 70]
    })

    boundaries.forEach(b => {
        let details: string[] = []

        if (b.shape === 'address') {
            details.push(`radius: ${(b as AddressBoundary).radius}`)
            details.push(`address: ${(b as AddressBoundary).address}`)
        }
        else if (b.shape === 'circle') {
            details.push(`radius: ${(b as AddressBoundary).radius}`)
            details.push(`center: ${(b as CircleBoundary).latitude}, ${(b as CircleBoundary).longitude}`)
        }
        else if (b.shape === 'zip') {
            details.push(`zipcode: ${(b as ZipBoundary).zipcode}`)
        }
        else { // polygon
            details.push(`polygon: ${b.boundary?.length} points`)
        }
        table.push([`${b.name}\n${chalk.green(b.storeExternalId)}\n${chalk.cyan(b.shape)}`, `${details.join('\n')}`])
    })

    console.log(table.toString())
}

export { tableizeBoundaries }
