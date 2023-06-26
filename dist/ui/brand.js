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
exports.tableizeBrands = exports.selectBrand = exports.editBrand = void 0;
const address_1 = require("../ui/address");
const cli_table_1 = __importDefault(require("cli-table"));
const chalk_1 = __importDefault(require("chalk"));
const enquirer_1 = require("../helpers/enquirer");
const ds_middleware_1 = require("../helpers/ds-middleware");
const editBrand = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const brandForm = new enquirer_1.Form({
        message: `${chalk_1.default.cyanBright('brand details')} (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: [
            { name: 'name', message: `name`, initial: ((_a = context.brand) === null || _a === void 0 ? void 0 : _a.name) || '' },
            { name: 'brandExternalId', message: 'brand external id', initial: ((_b = context.brand) === null || _b === void 0 ? void 0 : _b.brandExternalId) || '' },
            { name: 'description', message: 'description', initial: ((_c = context.brand) === null || _c === void 0 ? void 0 : _c.description) || '' },
            { name: 'currencyCode', message: 'iso-4217 currency code', initial: ((_d = context.brand) === null || _d === void 0 ? void 0 : _d.currencyCode) || '' },
            { role: 'separator' },
            ...(0, address_1.addressPrompts)((_e = context.brand) === null || _e === void 0 ? void 0 : _e.address)
        ],
        validate: (input) => {
            return input.name.length === 0 && 'name is required' ||
                (0, address_1.validateAddress)(input) ||
                true;
        }
    });
    return yield brandForm.run();
});
exports.editBrand = editBrand;
const selectBrand = (context) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.brand) {
        return context.brand;
    }
    const brands = (0, ds_middleware_1.filterInactive)(yield context.ds.brand.get(), context);
    const selectedName = yield (new enquirer_1.AutoComplete({
        message: 'select a brand',
        choices: brands.map(brand => brand.name),
        multiple: false,
        limit: brands.length
    })).run();
    return brands.find(brand => brand.name === selectedName);
});
exports.selectBrand = selectBrand;
const tableizeBrands = (brands) => {
    const table = new cli_table_1.default({
        head: ['name\nbrandExternalId', 'address', 'description', 'currency', 'active', 'default'],
        colWidths: [30, 20, 20, 10, 10, 10]
    });
    brands.forEach(brand => {
        table.push([`${brand.name}\n${chalk_1.default.cyan(brand.brandExternalId)}`, (0, address_1.addressToString)(brand.address), brand.description || '--', brand.currencyCode || '--', brand.active ? chalk_1.default.bold.greenBright('x') : '', brand.isDefault ? chalk_1.default.bold.greenBright('x') : '']);
    });
    console.log(table.toString());
};
exports.tableizeBrands = tableizeBrands;
