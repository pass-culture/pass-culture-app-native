"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../tests/server");
global.beforeAll(() => {
    server_1.server.listen();
});
global.afterAll(() => {
    server_1.server.resetHandlers();
    server_1.server.close();
});
