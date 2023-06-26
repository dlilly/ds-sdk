"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableizeRates = void 0;
const cli_table_1 = __importDefault(require("cli-table"));
const tableizeRates = (rates) => {
    const table = new cli_table_1.default({
        head: ['dsp', 'amount', 'fee', 'est delivery'],
        colWidths: [30, 20, 20, 40]
    });
    rates.forEach(rate => {
        let amount = '--';
        if (rate.amount) {
            if (rate.currencyCode === 'USD') {
                amount = `$${rate.amount / 100}`;
            }
        }
        let fee = '--';
        if (rate.fee) {
            if (rate.currencyCode === 'USD') {
                fee = `$${rate.fee / 100}`;
            }
        }
        let deliveryTime = '--';
        if (rate.estimatedDeliveryTime) {
            deliveryTime = new Date(rate.estimatedDeliveryTime).toUTCString();
        }
        table.push([`${rate.provider}`, `${amount}`, `${fee}`, `${deliveryTime}`]);
    });
    console.log(table.toString());
};
exports.tableizeRates = tableizeRates;
