import axios, { AxiosRequestConfig } from "axios"
import { PickupLocation } from "./model/location"
import { Brand } from "./model/brand"
import { Package } from "./model/package"

const baseURL = `https://sandbox.api.deliverysolutions.co/api/v2`

class DeliverySolutionsClient {
    tenantId: string
    apiKey: string

    constructor(tenantId: string, apiKey: string) {
        this.tenantId = tenantId
        this.apiKey = apiKey
    }

    async do(apiPath: string, init?: AxiosRequestConfig) {
        const response = await axios.request({
            ...init,
            url: encodeURI(`${baseURL}${apiPath}`),
            headers: {
                'tenantId': this.tenantId,
                'x-api-key': this.apiKey
            },
            // proxy: {
            //     protocol: 'http',
            //     host: '127.0.0.1',
            //     port: 8888
            // }
        })
        return response.data
    }

    async get(apiPath: string) {
        return await this.do(apiPath, {
            method: 'get'
        })
    }

    // deno-lint-ignore no-explicit-any
    async post(apiPath: string, data: any): Promise<any> {
        return await this.do(apiPath, {
            method: 'post',
            data
        })
    }

    async delete(apiPath: string): Promise<any> {
        return await this.do(apiPath, {
            method: 'delete'
        })
    }

    /* brand methods */
    async getBrands(): Promise<Brand[]> {
        return await this.get('/brand')
    }

    async getBrand(id: string): Promise<Brand> {
        return await this.get(`/brand/getById/brandExternalId/${id}`)
    }

    async createBrand(brand: Brand): Promise<Brand> {
        return await this.post('/brand', brand)
    }
    /* end brand methods */

    async createPackage(pkg: Package) {
        return await this.post('/package', pkg)
    }

    async getPackages(): Promise<Package[]> {
        return await this.get('/package')
    }

    async getPackage(id: string): Promise<Package> {
        return await this.get(`/package/getById/packageExternalId/${id}`)
    }

    async deletePackage(id: string): Promise<Package> {
        return await this.delete(`/package/packageExternalId/${id}`)
    }

    async getPickupLocations(): Promise<PickupLocation[]> {
        return await this.get('/store')
    }
}

export { DeliverySolutionsClient }