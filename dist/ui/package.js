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
exports.tableizePackages = exports.selectPackage = exports.editPackage = void 0;
const chalk_1 = __importDefault(require("chalk"));
const input_1 = require("../helpers/input");
const cli_table_1 = __importDefault(require("cli-table"));
const enquirer_1 = require("../helpers/enquirer");
class PackageInput {
}
const editPackage = (pkg) => {
    var _a, _b, _c;
    return new enquirer_1.Form({
        message: `package details (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: [
            { name: 'name', message: 'package name', initial: (pkg === null || pkg === void 0 ? void 0 : pkg.name) || '' },
            { name: 'packageExternalId', message: 'package external id', initial: (pkg === null || pkg === void 0 ? void 0 : pkg.packageExternalId) || '' },
            { name: 'weight', message: 'weight (lb)', initial: `${(pkg === null || pkg === void 0 ? void 0 : pkg.weight) || ''}` },
            { name: 'height', message: 'height (in)', initial: `${((_a = pkg === null || pkg === void 0 ? void 0 : pkg.size) === null || _a === void 0 ? void 0 : _a.height) || ''}` },
            { name: 'width', message: 'width (in)', initial: `${((_b = pkg === null || pkg === void 0 ? void 0 : pkg.size) === null || _b === void 0 ? void 0 : _b.width) || ''}` },
            { name: 'length', message: 'length (in)', initial: `${((_c = pkg === null || pkg === void 0 ? void 0 : pkg.size) === null || _c === void 0 ? void 0 : _c.length) || ''}` }
        ],
        validate: (input) => {
            return input.name.length === 0 && 'package name is required' ||
                input.packageExternalId.length === 0 && 'package external id is required' ||
                !(0, input_1.validateIsPositive)(input.weight) && 'weight must be > 0' ||
                !(0, input_1.validateIsPositive)(input.height) && 'height must be > 0' ||
                !(0, input_1.validateIsPositive)(input.width) && 'width must be > 0' ||
                !(0, input_1.validateIsPositive)(input.length) && 'length must be > 0' ||
                (pkg === null || pkg === void 0 ? void 0 : pkg.packageExternalId) && (pkg === null || pkg === void 0 ? void 0 : pkg.packageExternalId) !== input.packageExternalId && 'cannot change package external id' ||
                true;
        },
        result: (input) => ({
            name: input.name,
            packageExternalId: input.packageExternalId,
            weight: parseFloat(input.weight),
            size: {
                height: parseFloat(input.height),
                width: parseFloat(input.width),
                length: parseFloat(input.length),
            }
        })
    }).run();
};
exports.editPackage = editPackage;
const selectPackage = (context) => __awaiter(void 0, void 0, void 0, function* () {
    if (context.pkg) {
        return context.pkg;
    }
    const packages = yield context.ds.package.get();
    const packageName = yield (new enquirer_1.AutoComplete({
        name: 'package',
        message: `select a package`,
        limit: packages.length,
        multiple: false,
        choices: packages.map(p => p.name)
    })).run();
    return packages.find(pkg => pkg.name === packageName);
});
exports.selectPackage = selectPackage;
const tableizePackages = (packages) => {
    const table = new cli_table_1.default({
        head: ['name\npackageExternalId', 'weight\n(lb)', 'height\n(in)', 'width\n(in)', 'length\n(in)'],
        colWidths: [30, 10, 10, 10, 10]
    });
    packages.forEach(pkg => {
        var _a, _b, _c;
        table.push([`${pkg.name}\n${chalk_1.default.cyan(pkg.packageExternalId)}`, `${pkg.weight}`, `${(_a = pkg.size) === null || _a === void 0 ? void 0 : _a.height}`, `${(_b = pkg.size) === null || _b === void 0 ? void 0 : _b.width}`, `${(_c = pkg.size) === null || _c === void 0 ? void 0 : _c.length}`]);
    });
    console.log(table.toString());
};
exports.tableizePackages = tableizePackages;
