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
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = exports.description = exports.command = void 0;
const boundary_1 = require("../ui/boundary");
exports.command = 'boundary';
exports.description = 'manage boundaries';
const options = (yargs) => yargs
    .option('l', {
    alias: 'pickup-location',
    describe: 'pickup location id',
    type: 'array'
});
const builder = (yargs) => yargs
    .command("list", "list boundaries", options, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const boundaries = yield context.ds.boundary.get();
    (0, boundary_1.tableizeBoundaries)(boundaries);
}))
    .help();
exports.builder = builder;
