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
Object.defineProperty(exports, "__esModule", { value: true });
exports.webAppProxyMiddleware = exports.metasResponseInterceptor = void 0;
const firebase_functions_1 = require("firebase-functions");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const env_1 = require("../libs/environment/env");
const types_1 = require("../services/entities/types");
const metas_1 = require("../utils/metas");
const { APP_PROXY_URL } = env_1.env;
const { href } = new URL(APP_PROXY_URL);
const ENTITY_PATH_REGEXP = new RegExp(`/(${Object.keys(types_1.ENTITY_MAP).join('|')})/(\\d+)`);
const options = {
    target: href,
    changeOrigin: true,
    ws: true,
    selfHandleResponse: true,
    onProxyRes: (0, http_proxy_middleware_1.responseInterceptor)(metasResponseInterceptor),
};
function metasResponseInterceptor(responseBuffer, proxyRes, req) {
    return __awaiter(this, void 0, void 0, function* () {
        if (proxyRes.headers['content-type'] !== 'text/html') {
            return responseBuffer;
        }
        const html = responseBuffer.toString('utf8');
        let match;
        /* istanbul ignore next */
        // error with istanbul thinking there is a else path
        if (req.url) {
            match = ENTITY_PATH_REGEXP.exec(req.url);
        }
        const [endpoint, entityKey, id] = match || [];
        if (!id) {
            return html;
        }
        try {
            return (0, metas_1.replaceHtmlMetas)(html, endpoint, entityKey, Number(id));
        }
        catch (error) {
            // FIXME: when replaceHtmlMetas can really throw error, restore coverage for following lines and add a throw error unit test
            /* istanbul ignore next */
            // eslint-disable-next-line no-console
            firebase_functions_1.logger.info(`Replacing HTML metas failed: ${error.message}`);
            /* istanbul ignore next */
            return html;
        }
    });
}
exports.metasResponseInterceptor = metasResponseInterceptor;
exports.webAppProxyMiddleware = (0, http_proxy_middleware_1.createProxyMiddleware)(options);
