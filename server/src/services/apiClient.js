"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.apiClient = void 0;
const cross_fetch_1 = __importStar(require("cross-fetch"));
const env_1 = require("../libs/environment/env");
const types_1 = require("./entities/types");
const { API_BASE_URL, API_BASE_PATH_NATIVE_V1, PROXY_CACHE_CONTROL } = env_1.env;
const { href } = new URL(API_BASE_URL);
function apiClient(type, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const entityValue = types_1.ENTITY_MAP[type];
        if (!entityValue) {
            throw new Error(`Unknown entity: ${type}`);
        }
        const url = `${href}${API_BASE_PATH_NATIVE_V1}/${entityValue.API_MODEL_NAME}/${id}`;
        const response = yield (0, cross_fetch_1.default)(url, {
            headers: new cross_fetch_1.Headers({
                'cache-control': PROXY_CACHE_CONTROL,
            }),
        });
        if (response.status === 200) {
            return response.json();
        }
        throw new Error(`Wrong status code: ${response.status}`);
    });
}
exports.apiClient = apiClient;
