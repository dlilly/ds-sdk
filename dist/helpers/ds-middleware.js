"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterInactive = exports.showInactiveBuilder = exports.middleware = void 0;
const client_1 = require("../ds/client");
const middleware = (context) => {
    if (!context.ds) {
        const tenantId = context.dsTenantId || process.env['DS_TENANT_ID'];
        const apiKey = context.dsApiKey || process.env['DS_API_KEY'];
        if (!tenantId || !apiKey) {
            throw `api key or tenant id missing`;
        }
        context.ds = (0, client_1.DSClient)(tenantId, apiKey);
    }
};
exports.middleware = middleware;
const showInactiveBuilder = (yargs) => yargs
    .option('i', {
    alias: 'showInactive',
    default: false,
    boolean: true,
    describe: 'show inactive'
});
exports.showInactiveBuilder = showInactiveBuilder;
const filterInactive = (arr, context) => arr.filter(a => context.showInactive || a.active);
exports.filterInactive = filterInactive;
