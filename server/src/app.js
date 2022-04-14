"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const webAppProxyMiddleware_1 = require("./middlewares/webAppProxyMiddleware");
exports.app = (0, express_1.default)();
exports.app.use('*', webAppProxyMiddleware_1.webAppProxyMiddleware);
