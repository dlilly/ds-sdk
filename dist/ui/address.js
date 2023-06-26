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
exports.DSDeliveryServices = exports.promptForServices = exports.promptForAddress = exports.validateAddress = exports.addressPrompts = exports.addressToString = void 0;
const enquirer_1 = require("../helpers/enquirer");
const chalk_1 = __importDefault(require("chalk"));
const addressToString = (address) => {
    return `${address.street}\n${address.city}, ${address.state}\n${address.zipcode} ${address.country || ''}`;
};
exports.addressToString = addressToString;
const addressPrompts = (address) => [
    { name: 'street', message: `street address`, initial: (address === null || address === void 0 ? void 0 : address.street) || '' },
    { name: 'street2', message: 'street address (cont)', initial: (address === null || address === void 0 ? void 0 : address.street2) || '' },
    { name: 'apartmentNumber', message: 'apt/unit/ste #', initial: (address === null || address === void 0 ? void 0 : address.apartmentNumber) || '' },
    { name: 'city', message: 'city', initial: (address === null || address === void 0 ? void 0 : address.city) || '' },
    { name: 'state', message: 'state', initial: (address === null || address === void 0 ? void 0 : address.state) || '' },
    { name: 'country', message: 'country', initial: (address === null || address === void 0 ? void 0 : address.country) || '' },
    { name: 'zipcode', message: 'zipcode', initial: (address === null || address === void 0 ? void 0 : address.zipcode) || '' },
    { name: 'latitude', message: 'latitude', initial: (address === null || address === void 0 ? void 0 : address.latitude) || '' },
    { name: 'longitude', message: 'longitude', initial: (address === null || address === void 0 ? void 0 : address.longitude) || '' },
];
exports.addressPrompts = addressPrompts;
const validateAddress = (input) => {
    return input.street.length === 0 && 'street address is required' ||
        input.city.length === 0 && 'city is required' ||
        input.state.length === 0 && 'state is required' ||
        input.zipcode.length === 0 && 'zipcode is required';
};
exports.validateAddress = validateAddress;
const promptForAddress = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return context.zipcode ? context : yield new enquirer_1.Form({
        message: `${chalk_1.default.cyanBright('delivery address')} (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.greenBright('↵')} to submit)`,
        choices: addressPrompts(context),
        validate: (input) => {
            return input.zipcode.length === 0 && 'zipcode is required' ||
                true;
        }
    }).run();
});
exports.promptForAddress = promptForAddress;
const DSDeliveryServices = ["dsp", "store-boundary", "store-boundary-dsp"];
exports.DSDeliveryServices = DSDeliveryServices;
const promptForServices = (context) => __awaiter(void 0, void 0, void 0, function* () {
    return context.allServices ? DSDeliveryServices : context.services || (yield new enquirer_1.MultiSelect({
        message: `select services (${chalk_1.default.whiteBright('↑/↓/⇥')} to navigate, ${chalk_1.default.green('space')} to select, ${chalk_1.default.greenBright('↵')} to submit)`,
        limit: DSDeliveryServices.length,
        initial: context.services,
        choices: DSDeliveryServices
    }).run());
});
exports.promptForServices = promptForServices;
