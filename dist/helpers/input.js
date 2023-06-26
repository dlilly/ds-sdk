"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIsPositive = void 0;
const validateIsPositive = (input) => !isNaN(parseFloat(input)) && parseFloat(input) > 0;
exports.validateIsPositive = validateIsPositive;
