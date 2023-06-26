"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const yargs_builder_1 = __importDefault(require("./helpers/yargs-builder"));
const ds_middleware_1 = require("./helpers/ds-middleware");
yargs_1.default
    .usage(`usage: $0 <command>`)
    .scriptName(`ds`)
    .middleware(ds_middleware_1.middleware)
    .commandDir(`./commands`, Object.assign({}, yargs_builder_1.default))
    .argv;
