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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableizeLocations = exports.selectLocation = exports.editPickupLocation = void 0;
const { AutoComplete, Form, Confirm } = require('enquirer');
const chalk_1 = __importDefault(require("chalk"));
const cli_table_1 = __importDefault(require("cli-table"));
const address_1 = require("./address");
const contact_1 = require("./contact");
const editPickupLocation = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const defaultBrand = yield context.ds.brand.getDefault();
    const business = yield context.ds.business.get();
    return yield new Form({
        message: `${chalk_1.default.cyanBright('location details')} (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: [
            { name: 'name', message: `name`, initial: ((_a = context.location) === null || _a === void 0 ? void 0 : _a.name) || '' },
            { name: 'storeExternalId', message: 'store external id', initial: ((_b = context.location) === null || _b === void 0 ? void 0 : _b.storeExternalId) || '' },
            { name: 'brandExternalId', message: 'brand external id', initial: ((_c = context.location) === null || _c === void 0 ? void 0 : _c.brandExternalId) || defaultBrand.brandExternalId },
            { name: 'description', message: 'description', initial: ((_d = context.location) === null || _d === void 0 ? void 0 : _d.description) || '' },
            { name: 'currencyCode', message: 'iso-4217 currency code', initial: ((_e = context.location) === null || _e === void 0 ? void 0 : _e.currencyCode) || business.currencyCode },
            { role: 'separator' },
            ...(0, contact_1.contactPrompts)((_f = context.location) === null || _f === void 0 ? void 0 : _f.contact),
            { role: 'separator' },
            ...(0, address_1.addressPrompts)((_g = context.location) === null || _g === void 0 ? void 0 : _g.address)
        ],
        validate: (input) => {
            return input.name.length === 0 && 'name is required' ||
                input.storeExternalId.length === 0 && 'store external id is required' ||
                (0, contact_1.validateContact)(input) ||
                (0, address_1.validateAddress)(input) ||
                true;
        },
        result: (input) => (Object.assign(Object.assign({}, input), { address: input, contact: {
                name: input.contactName,
                phone: input.contactPhone
            } }))
    }).run();
});
exports.editPickupLocation = editPickupLocation;
const selectLocation = (context, multiple) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.location) {
        return context.location;
    }
    const locations = yield context.ds.location.get();
    const selectedName = yield (new AutoComplete({
        message: multiple ? `select locations (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.green('space')} to select, ${chalk_1.default.greenBright('↵')} to submit)` : 'select a location',
        choices: locations.map(l => l.name),
        multiple,
        limit: locations.length
    })).run();
    return locations.find(loc => loc.name === selectedName);
});
exports.selectLocation = selectLocation;
const tableizeLocations = (locations) => {
    const table = new cli_table_1.default({
        head: ['name\nstoreExternalId', 'contact', 'address', 'currency', 'active'],
        colWidths: [30, 20, 30, 10, 10]
    });
    locations.forEach(loc => {
        table.push([`${loc.name}\n${chalk_1.default.cyan(loc.storeExternalId)}`, `${loc.contact.name}\n${loc.contact.phone}`, (0, address_1.addressToString)(loc.address), `${loc.currencyCode}`, loc.active ? chalk_1.default.bold.greenBright('x') : '']);
    });
    console.log(table.toString());
};
exports.tableizeLocations = tableizeLocations;
