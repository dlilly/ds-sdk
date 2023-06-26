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
const location_1 = require("../ui/location");
const ds_middleware_1 = require("../helpers/ds-middleware");
exports.command = 'location';
exports.description = 'manage locations';
const builder = (yargs) => yargs
    .middleware((context, y) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.storeExternalId) {
        try {
            context.location = yield context.ds.location.getOne(context.storeExternalId);
        }
        catch (error) {
            throw `${chalk_1.default.redBright('error')} location ${chalk_1.default.green(context.storeExternalId)} not found`;
        }
    }
}))
    .command("create", "create a location", {}, function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const created = yield context.ds.location.create(yield (0, location_1.editPickupLocation)(context));
        (0, location_1.tableizeLocations)([created]);
        console.log(`${chalk_1.default.greenBright('success')} created location ${created.storeExternalId}`);
    });
})
    .command("edit [storeExternalId]", "edit a location", {}, function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.location = context.location || (yield (0, location_1.selectLocation)(context));
        const updated = yield context.ds.location.update(yield (0, location_1.editPickupLocation)(context));
        (0, location_1.tableizeLocations)([updated]);
        console.log(`${chalk_1.default.greenBright('success')} updated location ${updated.storeExternalId}`);
    });
})
    .command("get [storeExternalId]", "get a location by storeExternalId", {}, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, location_1.tableizeLocations)([yield (0, location_1.selectLocation)(context)]);
}))
    .command("list", "list locations", ds_middleware_1.showInactiveBuilder, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, location_1.tableizeLocations)((0, ds_middleware_1.filterInactive)(yield context.ds.location.get(), context));
}))
    .help();
exports.builder = builder;
