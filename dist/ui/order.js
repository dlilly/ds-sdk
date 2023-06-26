"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableizeOrders = void 0;
const cli_table_1 = __importDefault(require("cli-table"));
const tableizeOrders = (orders) => {
    const table = new cli_table_1.default({
        head: ['id', 'status'],
        colWidths: [30, 20]
    });
    orders.forEach(order => {
        table.push([order.orderExternalId, order.status]);
    });
    console.log(table.toString());
};
exports.tableizeOrders = tableizeOrders;
