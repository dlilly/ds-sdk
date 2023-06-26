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
const { Confirm } = require('enquirer');
const chalk_1 = __importDefault(require("chalk"));
const package_1 = require("../ui/package");
exports.command = 'package';
exports.description = 'manage packages';
const builder = (yargs) => yargs
    .middleware((context, y) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.packageExternalId) {
        try {
            context.pkg = yield context.ds.package.getOne(context.packageExternalId);
        }
        catch (error) {
            throw `${chalk_1.default.redBright('error')} package ${chalk_1.default.green(context.packageExternalId)} not found`;
        }
    }
}))
    .command("create", "create a package", {}, function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const created = yield context.ds.package.create(yield (0, package_1.editPackage)());
        (0, package_1.tableizePackages)([created]);
        console.log(`${chalk_1.default.greenBright('success')} created package ${created.packageExternalId}`);
    });
})
    .command("update [packageExternalId]", "update package", {}, (context) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield context.ds.package.update(yield (0, package_1.editPackage)(yield (0, package_1.selectPackage)(context)));
    (0, package_1.tableizePackages)([updated]);
    console.log(`${chalk_1.default.greenBright('success')} updated package ${updated.packageExternalId}`);
}))
    .command("get [packageExternalId]", "get package details", {}, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, package_1.tableizePackages)([yield (0, package_1.selectPackage)(context)]);
}))
    .command("list", "list packages", {}, (context) => __awaiter(void 0, void 0, void 0, function* () {
    (0, package_1.tableizePackages)(yield context.ds.package.get());
}))
    .command("delete [packageExternalId]", "delete a package", {}, function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const pkg = yield (0, package_1.selectPackage)(context);
        if (yield (new Confirm({ message: `delete package ${chalk_1.default.green(pkg.packageExternalId)}`, initial: true })).run()) {
            try {
                const deleted = yield context.ds.package.delete(pkg.packageExternalId);
                (0, package_1.tableizePackages)([deleted]);
                console.log(`${chalk_1.default.greenBright('success')} package ${chalk_1.default.green(deleted.packageExternalId)} deleted`);
            }
            catch (error) {
                throw `${chalk_1.default.red('error')} deleting package ${chalk_1.default.green(pkg.packageExternalId)}: ${error}`;
            }
        }
    });
})
    .help();
exports.builder = builder;
