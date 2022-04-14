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
const apiClient_1 = require("../apiClient");
describe('apiClient', () => {
    it(`should get offer ${constants_1.OFFER_RESPONSE_SNAP.id}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const offer = yield (0, apiClient_1.apiClient)('offre', constants_1.OFFER_RESPONSE_SNAP.id);
        expect(offer).toEqual(constants_1.OFFER_RESPONSE_SNAP);
    }));
    it(`should get venue ${constants_1.VENUE_RESPONSE_SNAP.id}`, () => __awaiter(void 0, void 0, void 0, function* () {
        const offer = yield (0, apiClient_1.apiClient)('lieu', constants_1.VENUE_RESPONSE_SNAP.id);
        expect(offer).toEqual(constants_1.VENUE_RESPONSE_SNAP);
    }));
    it('should throw error with wrong entity type', () => __awaiter(void 0, void 0, void 0, function* () {
        const wrongEntityType = 'settings';
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, apiClient_1.apiClient)(wrongEntityType, 0); })).rejects.toThrowError(new Error(`Unknown entity: ${wrongEntityType}`));
    }));
    it(`should throw error when status code is 404 instead of 200`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(() => __awaiter(void 0, void 0, void 0, function* () { return yield (0, apiClient_1.apiClient)('offre', 0); })).rejects.toThrowError(new Error(`Wrong status code: 404`));
    }));
});
