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
const server_1 = require("../tests/server");
const env_1 = require("./libs/environment/__mocks__/env");
describe('express server', () => {
    let server;
    let initialEnv;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        initialEnv = process.env.ENV;
        process.env.ENV = 'testing';
        const { server: newServer } = yield Promise.resolve().then(() => __importStar(require('./index')));
        server = newServer;
    }));
    afterAll((done) => {
        process.env.ENV = initialEnv;
        server.close(done);
    });
    it(`should listen on port 8080`, () => {
        const addressInfo = server.address();
        expect(server.listening).toBe(true);
        expect(addressInfo.port).toBe(8080);
    });
    it(`should return same index.html from ${env_1.env.APP_PUBLIC_URL} as from ${env_1.env.APP_PROXY_URL} (proxy)`, () => __awaiter(void 0, void 0, void 0, function* () {
        server_1.server.close();
        const response = yield fetch(env_1.env.APP_PUBLIC_URL);
        const html = yield response.text();
        const responseProxy = yield fetch(env_1.env.APP_PROXY_URL);
        const htmlProxy = yield responseProxy.text();
        expect(html).toEqual(htmlProxy);
    }));
});
