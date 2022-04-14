"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const path_1 = require("path");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({
    path: (0, path_1.resolve)(__dirname, '../../..', `.env.${process.env.ENV}`),
});
exports.env = process.env;
