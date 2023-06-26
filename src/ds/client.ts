import axios, { AxiosRequestConfig } from "axios"
import { PickupLocation } from "../model/location"
import { Brand } from "../model/brand"
import { Package } from "../model/package"
import _ from 'lodash'
import { Rate } from "../model/rate"
import { Business } from "../model/business"
import { DeliveryAssurancePayload, DeliveryAssuranceResult } from "./da-payload"
import { Order, OrderInput } from "../model/order"
import { OrderStatus } from "../model/orderstatus"
import { Boundary } from "../model/boundary"
import { ConfiguredReturnMethod, ReturnMethod } from "../model/returns"
import { BrandTimingQuery, StoreTimingQuery, TimingQuery, TimingType, TimingTypes } from "../model/common"

const baseURL = `https://sandbox.api.deliverysolutions.co/api/v2`

/*
    Delivery Solutions client interface
*/
interface DeliverySolutionsClient {
    business: {
        get: () => Promise<Business>
    },
    boundary: {
        get: () => Promise<Boundary[]>
    },
    brand: {
        get: () => Promise<Brand[]>,
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
    },
    order: {
        get: () => Promise<Order[]>,
        getOne: (id: string) => Promise<Order>,
        create: (order: OrderInput) => Promise<Order>,
        cancel: (order: Order) => Promise<Order>,
        updateStatus: (order: Order, status: OrderStatus) => Promise<Order>
    },
    returns: {
        methods: {
            get: () => Promise<ConfiguredReturnMethod[]>,
            list: () => Promise<ReturnMethod[]>
        }
    },
    smartWindow: {
        get: (stores: PickupLocation[], types: string[]) => Promise<any>,
        timings: {
            getByStore: (type: TimingType, id: string) => Promise<any>,
            getByBrand: (type: TimingType, id: string) => Promise<any>
        }
    }
}

const DSClient = (tenantId: string, apiKey: string): DeliverySolutionsClient => {
    const request = async (apiPath: string, init?: AxiosRequestConfig) => {
        let uri = `${baseURL}${apiPath}`
        if (apiPath.indexOf('/store/boundary') > -1) {
            uri = uri.replace('/api/v2', '')
        }
        const url = encodeURI(uri)
        return await axios.request({
            ...init,
            url,
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
        boundary: {
            get: async (): Promise<Boundary[]> => {
                const boundaries = (await http.get('/store/boundary')).data

                for await (let b of boundaries) {
                    if (b.shape === 'circle' && !b.longitude && !b.latitude && !b.address) {
                        // if we have no specified center point lat/lng or address we use the store's location
                        const store = await ds.location.getOne(b.storeExternalId)
                        b.latitude = store.address.latitude
                        b.longitude = store.address.longitude
                    }
                }

                return boundaries
            }
        },
        brand: {
            get: (): Promise<Brand[]> => http.get(`/brand`),
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
        },
        order: {
            get: (): Promise<Order[]> => http.post('/order/list', {}).then(x => x.data),
            getOne: (id: string): Promise<Order> => http.get(`/order/getById/orderExternalId/${id}`),
            create: async (order: OrderInput): Promise<Order> => {
                const o = {
                    ...order,
                    pickupTime: null,
                    pickupTimeStart: null,
                    pickupTimeEnd: null,
                    dropoffTime: null,
                    dropoffTimeStart: null,
                    dropoffTimeEnd: null,
                    dispatch: {
                        type: 'immediate'
                    }
                }

                console.log(JSON.stringify(o, undefined, 4))

                return await http.post('/order/placeorder', o)
            },
            cancel: (order: Order): Promise<Order> => http.delete(`/order/orderExternalId/${order.orderExternalId}`),
            updateStatus: async (order: Order, status: OrderStatus): Promise<Order> => {
                // post the update
                await http.post(`/order/updateOrderStatus/orderExternalId/${order.orderExternalId}`, {
                    status
                })

                // return the updated resource
                return await ds.order.getOne(order.orderExternalId)
            }
        },
        returns: {
            methods: {
                get: (): Promise<ConfiguredReturnMethod[]> => http.get('/returns/methods'),
                list: (): Promise<ReturnMethod[]> => http.get('/returns/supported-methods')
            }
        },
        smartWindow: {
            get: async (stores: PickupLocation[], types: string[]): Promise<any> => {
                return await http.post('/smartWindows', {
                    storeExternalIds: stores.map(s => s.storeExternalId),
                    types
                })
            },
            timings: {
                getByStore: (type: TimingType, id: string): Promise<any> => http.get(`/timings/${type}?storeExternalId=${id}`),
                getByBrand: (type: TimingType, id: string): Promise<any> => http.get(`/timings/${type}?brandExternalId=${id}`)
            }
        }
    }

    return ds
}

export { DeliverySolutionsClient, DSClient }