"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const firebase_functions_1 = require("firebase-functions");
const app_1 = require("./app");
const PORT = Number(process.env.PORT) || 8080;
exports.server = app_1.app.listen(PORT, () => {
    /* istanbul ignore next */
    // eslint-disable-next-line no-console
    process.env.NODE_ENV !== 'test' && firebase_functions_1.logger.info(`[${process.env.ENV}] Listening on port ${PORT}`);
});
