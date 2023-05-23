import axios, { AxiosRequestConfig } from "axios"
import { PickupLocation } from "../model/location"
import { Brand } from "../model/brand"
import { Package } from "../model/package"
import _ from 'lodash'
import { Rate } from "../model/rate"
import { Business } from "../model/business"
import { DeliveryAssurancePayload, DeliveryAssuranceResult } from "./da-payload"

const baseURL = `https://sandbox.api.deliverysolutions.co/api/v2`

/*
    Delivery Solutions client interface
*/
interface DeliverySolutionsClient {
    business: {
        get: () => Promise<Business>
    },
    brand: {
        get: (opts?: { filterActive: boolean }) => Promise<Brand[]>,
        getDefault: () => Promise<Brand>,
        getOne: (id: string) => Promise<Brand>,
        create: (brand: Brand) => Promise<Brand>
    },
    package: {
        get: () => Promise<Package[]>,
        getOne: (id: string) => Promise<Package>,
        create: (pkg: Package) => Promise<Package>,
        update: (pkg: Package) => Promise<Package>,
        delete: (id: string) => Promise<Package>
    },
    location: {
        get: () => Promise<PickupLocation[]>,
        getOne: (id: string) => Promise<PickupLocation>
        create: (loc: PickupLocation) => Promise<PickupLocation>,
        update: (loc: PickupLocation) => Promise<PickupLocation>,
    },
    rate: {
        get: (location: PickupLocation, zipcode: string) => Promise<Rate[]>
    },
    deliveryAssurance: {
        check: (payload: DeliveryAssurancePayload) => Promise<DeliveryAssuranceResult>
    }
}

const DSClient = (tenantId: string, apiKey: string): DeliverySolutionsClient => {
    const request = async (apiPath: string, init?: AxiosRequestConfig) => {
        return await axios.request({
            ...init,
            url: encodeURI(`${baseURL}${apiPath}`),
            headers: {
                'tenantId': tenantId,
                'x-api-key': apiKey
            },
            // proxy: {
            //     protocol: 'http',
            //     host: '127.0.0.1',
            //     port: 8888
            // }
        })
    }

    /* http client wrapper */
    const http = {
        get: async (apiPath: string) => (await request(apiPath)).data,
        post: async (apiPath: string, data: any) => (await request(apiPath, { method: 'post', data })).data,
        patch: async (apiPath: string, data: any) => (await request(apiPath, { method: 'patch', data })).data,
        delete: async (apiPath: string) => (await request(apiPath, { method: 'delete' })).data
    }

    const ds = {
        business: {
            get: (): Promise<Business> => http.get('/business')
        },
        brand: {
            get: async (opts?: { filterActive: boolean }): Promise<Brand[]> => (await http.get('/brand')).filter((brand: { active: any }) => !opts?.filterActive || brand.active),
            getDefault: async (): Promise<Brand> => {
                const brands = await ds.brand.get()
                return brands.find(brand => brand.isDefault) || brands[0]
            },
            getOne: (id: string): Promise<Brand> => http.get(`/brand/getById/brandExternalId/${id}`),
            create: (brand: Brand): Promise<Brand> => http.post('/brand', brand)
        },
        package: {
            get: (): Promise<Package[]> => http.get('/package'),
            getOne: (id: string): Promise<Package> => http.get(`/package/getById/packageExternalId/${id}`),
            create: (pkg: Package): Promise<Package> => http.post('/package', pkg),
            update: (pkg: Package): Promise<Package> => http.post(`/package/packageExternalId/${pkg.packageExternalId}`, _.omit(pkg, 'packageExternalId')),
            delete: (id: string): Promise<Package> => http.delete(`/package/packageExternalId/${id}`)
        },
        location: {
            get: (): Promise<PickupLocation[]> => http.get(`/store`),
            getOne: (id: string): Promise<PickupLocation> => http.get(`/store/getById/storeExternalId/${id}`),
            create: (loc: PickupLocation): Promise<PickupLocation> => http.post('/store', loc),
            update: async (loc: PickupLocation): Promise<PickupLocation> => ({
                storeExternalId: loc.storeExternalId,
                ...await http.patch(`/store/storeExternalId/${loc.storeExternalId}`, _.omit(loc, ['storeExternalId','brandExternalId']))
            })
        },
        rate: {
            get: async (location: PickupLocation, zipcode: string): Promise<Rate[]> => (await http.post(`/rates`, {
                storeExternalIds: [location.storeExternalId],
                deliveryAddress: { zipcode }
            })).rates
        },
        deliveryAssurance: {
            check: (payload: DeliveryAssurancePayload): Promise<DeliveryAssuranceResult> => http.post('/deliveryAssurance', payload)
        }
    }

    return ds
}

export { DeliverySolutionsClient, DSClient }