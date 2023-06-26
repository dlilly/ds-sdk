"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateContact = exports.contactPrompts = exports.contactToString = void 0;
const contactToString = (contact) => {
    return `${contact.name}\n${contact.phone}`;
};
exports.contactToString = contactToString;
const contactPrompts = (contact) => [
    { name: 'name', message: `contact name`, initial: (contact === null || contact === void 0 ? void 0 : contact.name) || '' },
    { name: 'phone', message: 'contact phone #', initial: (contact === null || contact === void 0 ? void 0 : contact.phone) || '' }
];
exports.contactPrompts = contactPrompts;
const validateContact = (input) => {
    var _a, _b;
    return ((_a = input.name) === null || _a === void 0 ? void 0 : _a.length) === 0 && 'contact name is required' ||
        ((_b = input.phone) === null || _b === void 0 ? void 0 : _b.length) === 0 && 'contact phone is required';
};
exports.validateContact = validateContact;
