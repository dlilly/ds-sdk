"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableizeBoundaries = void 0;
const chalk_1 = __importDefault(require("chalk"));
const cli_table_1 = __importDefault(require("cli-table"));
const tableizeBoundaries = (boundaries) => {
    const table = new cli_table_1.default({
        head: ['name\nlocation\nshape', 'details'],
        colWidths: [30, 70]
    });
    boundaries.forEach(b => {
        var _a;
        let details = [];
        if (b.shape === 'address') {
            details.push(`radius: ${b.radius}`);
            details.push(`address: ${b.address}`);
        }
        else if (b.shape === 'circle') {
            details.push(`radius: ${b.radius}`);
            details.push(`center: ${b.latitude}, ${b.longitude}`);
        }
        else if (b.shape === 'zip') {
            details.push(`zipcode: ${b.zipcode}`);
        }
        else {
            details.push(`polygon: ${(_a = b.boundary) === null || _a === void 0 ? void 0 : _a.length} points`);
        }
        table.push([`${b.name}\n${chalk_1.default.green(b.storeExternalId)}\n${chalk_1.default.cyan(b.shape)}`, `${details.join('\n')}`]);
    });
    console.log(table.toString());
};
exports.tableizeBoundaries = tableizeBoundaries;
