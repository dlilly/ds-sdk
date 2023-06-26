"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableizeDeliveryAssuranceResult = void 0;
const chalk_1 = __importDefault(require("chalk"));
const cli_table_1 = __importDefault(require("cli-table"));
const mapStoreExternalIdsToStoreNames = (ids, locations) => {
    return ids.map(id => locations.find(loc => loc.storeExternalId === id)).map(l => (l === null || l === void 0 ? void 0 : l.name) || '??');
};
const tableizeDeliveryAssuranceResult = (result, locations) => {
    const table = new cli_table_1.default({
        head: ['service', 'dsp/store', 'errors'],
        colWidths: [25, 25, 50]
    });
    if (result.dsp) {
        table.push([chalk_1.default.blueBright('dsp'), result.dsp.value.join('\n'), JSON.stringify(result.dsp.errors || [], undefined, 4)]);
    }
    if (result.storeBoundary) {
        table.push([chalk_1.default.blueBright('store-boundary'), mapStoreExternalIdsToStoreNames(result.storeBoundary.value, locations).join('\n'), JSON.stringify(result.storeBoundary.errors || [], undefined, 4)]);
    }
    if (result.storeBoundaryDsp) {
        table.push([chalk_1.default.blueBright('store-boundary-dsp'), mapStoreExternalIdsToStoreNames(result.storeBoundaryDsp.value, locations).join('\n'), JSON.stringify(result.storeBoundaryDsp.errors || [], undefined, 4)]);
    }
    console.log(table.toString());
};
exports.tableizeDeliveryAssuranceResult = tableizeDeliveryAssuranceResult;
