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
const { Input } = require('enquirer');
const chalk_1 = __importDefault(require("chalk"));
const rate_1 = require("../ui/rate");
const location_1 = require("../ui/location");
exports.command = 'rate';
exports.description = 'get rates';
const rateBuilder = (yargs) => yargs
    .option('l', {
    alias: 'pickupLocation',
    describe: 'pickup location id'
})
    .option('z', {
    alias: 'zipcode',
    describe: 'delivery zipcode',
    type: 'string'
});
const builder = (yargs) => yargs
    .middleware((context, y) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.pickupLocation) {
        try {
            context.location = yield context.ds.location.getOne(context.pickupLocation);
        }
        catch (error) {
            throw `${chalk_1.default.redBright('error')} location ${chalk_1.default.green(context.pickupLocation)} not found`;
        }
    }
}))
    .command("get", "get rates", rateBuilder, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const location = yield (0, location_1.selectLocation)(context, false);
    const zipcode = context.zipcode || (yield new Input({ message: 'delivery zip code' }).run());
    const result = yield context.ds.rate.get(location, zipcode);
    (0, rate_1.tableizeRates)(result);
}))
    .help();
exports.builder = builder;
