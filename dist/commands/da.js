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
const enquirer_1 = require("../helpers/enquirer");
const address_1 = require("../ui/address");
const da_1 = require("../ui/da");
exports.command = 'da';
exports.description = 'delivery assurance';
const options = (yargs) => yargs
    .option('l', {
    alias: 'pickup-location',
    describe: 'pickup location id'
})
    .option('z', {
    alias: 'zipcode',
    describe: 'delivery zipcode',
    type: 'string'
})
    .option('a', {
    alias: 'all-services',
    describe: 'query all services',
    type: 'boolean'
})
    .option('s', {
    alias: 'services',
    describe: 'services',
    type: 'array'
})
    .conflicts('a', 's');
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
    .command("check", "check delivery assurance", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = yield context.ds.location.get();
    const deliveryAddress = yield (0, address_1.promptForAddress)(context);
    console.log(deliveryAddress);
    const services = yield (0, address_1.promptForServices)(context);
    console.log(services);
    process.exit(0);
    const pickupLocation = context.location || services.includes('dsp') && (yield new enquirer_1.Select({
        message: `select pickup location (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.green('space')} to select, ${chalk_1.default.greenBright('↵')} to submit)`,
        limit: locations.length,
        choices: locations.map(l => l.name),
        result: (input) => locations.find(loc => loc.name === input)
    }).run());
    const result = yield context.ds.deliveryAssurance.check({
        deliveryAddress,
        services,
        storeExternalId: pickupLocation.storeExternalId
    });
    (0, da_1.tableizeDeliveryAssuranceResult)(Object.assign(Object.assign({}, result), { storeBoundary: result['store-boundary'], storeBoundaryDsp: result['store-boundary-dsp'] }), locations);
}))
    .help();
exports.builder = builder;
