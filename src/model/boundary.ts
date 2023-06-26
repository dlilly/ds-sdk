type LatitudeLongitude = {
    latitude: number
    longitude: number
}

type Boundary = {
    id: string
    storeExternalId: string
    shape: 'polygon' | 'circle' | 'zip' | 'address'
    status: 'active' | 'inactive'
    name: string
    type: 'in-service' | 'out-of-service'
    tags: string[]
    boundary: LatitudeLongitude[]
}

type CircleBoundary = Boundary & LatitudeLongitude & {
    radius: number
}

type AddressBoundary = Boundary & CircleBoundary & {
    address: string
}

type ZipBoundary = Boundary & {
    zipcode: string
}

export { Boundary, CircleBoundary, AddressBoundary, ZipBoundary }