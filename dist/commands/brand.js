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
exports.builder = exports.description = exports.command = void 0;
const chalk_1 = __importDefault(require("chalk"));
const brand_1 = require("../ui/brand");
const ds_middleware_1 = require("../helpers/ds-middleware");
exports.command = 'brand';
exports.description = 'manage brands';
const builder = (yargs) => yargs
    .middleware((context, y) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.brandExternalId) {
        try {
            context.brand = yield context.ds.brand.getOne(context.brandExternalId);
        }
        catch (error) {
            throw `${chalk_1.default.redBright('error')} brand ${chalk_1.default.green(context.brandExternalId)} not found`;
        }
    }
}))
    .command("create", "create a brand", {}, function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const brand = yield (0, brand_1.editBrand)(context);
        try {
            const returned = yield context.ds.brand.create(brand);
            console.log(returned);
        }
        catch (error) {
            console.log(`error: ${error}`);
        }
    });
})
    .command("get [brandExternalId]", "get a brand by its brandExternalId or select from a list", ds_middleware_1.showInactiveBuilder, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, brand_1.tableizeBrands)([yield (0, brand_1.selectBrand)(context)]);
}))
    .command("list", "list brands", ds_middleware_1.showInactiveBuilder, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, brand_1.tableizeBrands)((0, ds_middleware_1.filterInactive)(yield context.ds.brand.get(), context));
}))
    .help();
exports.builder = builder;
