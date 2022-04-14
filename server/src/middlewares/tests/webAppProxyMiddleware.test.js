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
const constants_1 = require("../../../tests/constants");
const env_1 = require("../../libs/environment/env");
const offer_1 = require("../../services/entities/offer");
const types_1 = require("../../services/entities/types");
const venue_1 = require("../../services/entities/venue");
const webAppProxyMiddleware_1 = require("../webAppProxyMiddleware");
describe('webAppProxyMiddleware', () => {
    const responseBuffer = Buffer.from(constants_1.TEST_HTML);
    const proxyRes = {
        headers: {
            'content-type': 'text/html',
        },
    };
    const req = {};
    describe('metasResponseInterceptor', () => {
        it('should return unmodified response buffer when content-type is NOT text/html', () => __awaiter(void 0, void 0, void 0, function* () {
            const imagePngResponseBuffer = Buffer.from('I am an image/png');
            const notTextHtmlProxyRes = {
                headers: {
                    'content-type': 'image/png',
                },
            };
            const unmodifiedResponseBuffer = yield (0, webAppProxyMiddleware_1.metasResponseInterceptor)(imagePngResponseBuffer, notTextHtmlProxyRes, req);
            expect(unmodifiedResponseBuffer).toEqual(imagePngResponseBuffer);
        }));
        it.only.each([
            [offer_1.OFFER.API_MODEL_NAME, 'offre', `${constants_1.OFFER_RESPONSE_SNAP.id}`],
            [venue_1.VENUE.API_MODEL_NAME, 'lieu', `${constants_1.VENUE_RESPONSE_SNAP.id}`],
            [venue_1.VENUE.API_MODEL_NAME, 'lieu', `${constants_1.VENUE_RESPONSE_ALTERNATIVE_SNAP.id}`],
        ])(`should edit html when req.url on %s use valid id: /%s/%s`, (entity, endpoint, id) => __awaiter(void 0, void 0, void 0, function* () {
            const url = `${env_1.env.APP_PUBLIC_URL}/${endpoint}${id ? `/${id}` : ''}`;
            const finalResponseBuffer = yield (0, webAppProxyMiddleware_1.metasResponseInterceptor)(responseBuffer, proxyRes, Object.assign(Object.assign({}, req), { url }));
            expect(finalResponseBuffer).not.toEqual(responseBuffer.toString('utf8'));
        }));
        it.each(Object.entries(types_1.ENTITY_MAP).map(([key, { API_MODEL_NAME }]) => [API_MODEL_NAME, key, '']))(`should not edit html when req.url on %s use valid id: /%s/%s`, (entity, endpoint, id) => __awaiter(void 0, void 0, void 0, function* () {
            const url = `${env_1.env.APP_PUBLIC_URL}/${endpoint}${id ? `/${id}` : ''}`;
            const finalResponseBuffer = yield (0, webAppProxyMiddleware_1.metasResponseInterceptor)(responseBuffer, proxyRes, Object.assign(Object.assign({}, req), { url }));
            expect(finalResponseBuffer).toEqual(responseBuffer.toString('utf8'));
        }));
    });
});
