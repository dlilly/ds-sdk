"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSClient = void 0;
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
const baseURL = `https://sandbox.api.deliverysolutions.co/api/v2`;
const DSClient = (tenantId, apiKey) => {
    const request = (apiPath, init) => __awaiter(void 0, void 0, void 0, function* () {
        let uri = `${baseURL}${apiPath}`;
        if (apiPath.indexOf('/store/boundary') > -1) {
            uri = uri.replace('/api/v2', '');
        }
        const url = encodeURI(uri);
        return yield axios_1.default.request(Object.assign(Object.assign({}, init), { url, headers: {
                'tenantId': tenantId,
                'x-api-key': apiKey
            } }));
    });
    const http = {
        get: (apiPath) => __awaiter(void 0, void 0, void 0, function* () { return (yield request(apiPath)).data; }),
        post: (apiPath, data) => __awaiter(void 0, void 0, void 0, function* () { return (yield request(apiPath, { method: 'post', data })).data; }),
        patch: (apiPath, data) => __awaiter(void 0, void 0, void 0, function* () { return (yield request(apiPath, { method: 'patch', data })).data; }),
        delete: (apiPath) => __awaiter(void 0, void 0, void 0, function* () { return (yield request(apiPath, { method: 'delete' })).data; })
    };
    const ds = {
        business: {
            get: () => http.get('/business')
        },
        boundary: {
            get: () => __awaiter(void 0, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                const boundaries = (yield http.get('/store/boundary')).data;
                try {
                    for (var _d = true, boundaries_1 = __asyncValues(boundaries), boundaries_1_1; boundaries_1_1 = yield boundaries_1.next(), _a = boundaries_1_1.done, !_a;) {
                        _c = boundaries_1_1.value;
                        _d = false;
                        try {
                            let b = _c;
                            if (b.shape === 'circle' && !b.longitude && !b.latitude && !b.address) {
                                const store = yield ds.location.getOne(b.storeExternalId);
                                b.latitude = store.address.latitude;
                                b.longitude = store.address.longitude;
                            }
                        }
                        finally {
                            _d = true;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = boundaries_1.return)) yield _b.call(boundaries_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return boundaries;
            })
        },
        brand: {
            get: () => http.get(`/brand`),
            getDefault: () => __awaiter(void 0, void 0, void 0, function* () {
                const brands = yield ds.brand.get();
                return brands.find(brand => brand.isDefault) || brands[0];
            }),
            getOne: (id) => http.get(`/brand/getById/brandExternalId/${id}`),
            create: (brand) => http.post('/brand', brand)
        },
        package: {
            get: () => http.get('/package'),
            getOne: (id) => http.get(`/package/getById/packageExternalId/${id}`),
            create: (pkg) => http.post('/package', pkg),
            update: (pkg) => http.post(`/package/packageExternalId/${pkg.packageExternalId}`, lodash_1.default.omit(pkg, 'packageExternalId')),
            delete: (id) => http.delete(`/package/packageExternalId/${id}`)
        },
        location: {
            get: () => http.get(`/store`),
            getOne: (id) => http.get(`/store/getById/storeExternalId/${id}`),
            create: (loc) => http.post('/store', loc),
            update: (loc) => __awaiter(void 0, void 0, void 0, function* () {
                return (Object.assign({ storeExternalId: loc.storeExternalId }, yield http.patch(`/store/storeExternalId/${loc.storeExternalId}`, lodash_1.default.omit(loc, ['storeExternalId', 'brandExternalId']))));
            })
        },
        rate: {
            get: (location, zipcode) => __awaiter(void 0, void 0, void 0, function* () {
                return (yield http.post(`/rates`, {
                    storeExternalIds: [location.storeExternalId],
                    deliveryAddress: { zipcode }
                })).rates;
            })
        },
        deliveryAssurance: {
            check: (payload) => http.post('/deliveryAssurance', payload)
        },
        order: {
            get: () => http.post('/order/list', {}).then(x => x.data),
            getOne: (id) => http.get(`/order/getById/orderExternalId/${id}`),
            create: (order) => __awaiter(void 0, void 0, void 0, function* () {
                const o = Object.assign(Object.assign({}, order), { pickupTime: null, pickupTimeStart: null, pickupTimeEnd: null, dropoffTime: null, dropoffTimeStart: null, dropoffTimeEnd: null, dispatch: {
                        type: 'immediate'
                    } });
                console.log(JSON.stringify(o, undefined, 4));
                return yield http.post('/order/placeorder', o);
            }),
            cancel: (orderExternalId) => http.delete(`/order/orderExternalId/${orderExternalId}`),
            updateStatus: (order, status) => __awaiter(void 0, void 0, void 0, function* () {
                yield http.post(`/order/updateOrderStatus/orderExternalId/${order.orderExternalId}`, {
                    type: order.type,
                    status
                });
                return yield ds.order.getOne(order.orderExternalId);
            })
        }
    };
    return ds;
};
exports.DSClient = DSClient;
