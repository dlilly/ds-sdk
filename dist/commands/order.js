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
const contact_1 = require("../ui/contact");
const short_uuid_1 = __importDefault(require("short-uuid"));
const input_1 = require("../helpers/input");
const order_1 = require("../ui/order");
const orderstatus_1 = require("../model/orderstatus");
exports.command = 'order';
exports.description = 'order management';
const orderTypeEnum = ['', 'delivery', 'in-store-pickup', 'curbside', 'shipping'];
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
    .option('o', {
    alias: 'orderExternalId',
    describe: 'order id',
    type: 'string'
});
const selectOrder = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield context.ds.order.get();
    const selectedOrderIds = yield (new enquirer_1.Select({
        message: `select order`,
        choices: orders.map(o => o.orderExternalId),
        limit: orders.length
    })).run();
    return orders.find(o => selectedOrderIds.includes(o.orderExternalId));
});
const selectOrders = (context) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield context.ds.order.get();
    const selectedOrderIds = yield (new enquirer_1.Select({
        message: `select orders (${chalk_1.default.whiteBright('↑/↓')} to navigate, ${chalk_1.default.green('space')} to select, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: orders.map(o => o.orderExternalId),
        multiple: true,
        limit: orders.length
    })).run();
    return orders.filter(o => selectedOrderIds.includes(o.orderExternalId));
});
const builder = (yargs) => yargs
    .middleware((context, y) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.pickupLocation) {
        try {
            context.location = yield context.ds.location.getOne(context.pickupLocation);
        }
        catch (error) {
            throw `${chalk_1.default.red('error')} location ${chalk_1.default.cyanBright(context.pickupLocation)} not found`;
        }
    }
    if (context.orderExternalId) {
        context.order = yield context.ds.order.getOne(context.orderExternalId);
    }
}))
    .command("create", "create new order", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = yield context.ds.location.get();
    const packages = yield context.ds.package.get();
    const deliveryAddress = yield new enquirer_1.Form({
        message: `${chalk_1.default.cyanBright('delivery address')} (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: (0, address_1.addressPrompts)(context),
        validate: (address) => (0, address_1.validateAddress)(address) || true
    }).run();
    const deliveryContact = yield new enquirer_1.Form({
        message: `${chalk_1.default.cyanBright('delivery contact')} (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: (0, contact_1.contactPrompts)(),
        validate: (contact) => (0, contact_1.validateContact)(contact) || true
    }).run();
    const pickupLocation = context.location || (yield new enquirer_1.Select({
        message: `pickup location (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        limit: locations.length,
        choices: locations.map(l => l.name),
        result: (input) => locations.find(loc => loc.name === input)
    }).run());
    const apackage = yield new enquirer_1.Select({
        message: `package type (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        limit: packages.length,
        choices: packages.map(p => p.name),
        result: (input) => packages.find(p => p.name === input)
    }).run();
    const quantity = yield new enquirer_1.Input({
        message: 'package quantity',
        initial: 1,
        validate: input_1.validateIsPositive,
        result: parseInt
    }).run();
    const order = yield context.ds.order.create({
        storeExternalId: pickupLocation.storeExternalId,
        orderExternalId: `${pickupLocation.storeExternalId}-${short_uuid_1.default.generate().substring(0, 8)}`,
        orderValue: yield new enquirer_1.Input({ message: `order value`, validate: input_1.validateIsPositive, result: parseFloat }).run(),
        deliveryContact,
        deliveryAddress,
        packages: [Object.assign({ quantity }, apackage)]
    });
    console.log(JSON.stringify(order));
}))
    .command("generate", "")
    .command("list", "list orders", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, order_1.tableizeOrders)(yield context.ds.order.get());
}))
    .command("history [orderExternalId]", "show order history", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(context.order);
}))
    .command("status update", "update status", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield selectOrders(context);
    const status = yield (new enquirer_1.Select({
        message: `select new order status`,
        choices: Object.values(orderstatus_1.OrderStatus),
        limit: Object.values(orderstatus_1.OrderStatus).length
    })).run();
    const updated = yield Promise.all(orders.map((order) => context.ds.order.updateStatus(order, status)));
    (0, order_1.tableizeOrders)(updated);
}))
    .command("cancel", "cancel order(s)", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = (yield selectOrders(context)).map(o => o.orderExternalId);
    const cancelled = yield Promise.all(orders.map(context.ds.order.cancel));
    (0, order_1.tableizeOrders)(cancelled);
}))
    .help();
exports.builder = builder;
