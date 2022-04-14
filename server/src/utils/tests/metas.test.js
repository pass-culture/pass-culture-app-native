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
const offer_1 = require("../../services/entities/offer");
const types_1 = require("../../services/entities/types");
const venue_1 = require("../../services/entities/venue");
const metas_1 = require("../metas");
const mockOfferMetasConfig = offer_1.OFFER;
const mockVenuMetasConfig = venue_1.VENUE;
const mockEntityMap = types_1.ENTITY_MAP;
const mockOfferResponse = constants_1.OFFER_RESPONSE_SNAP;
const mockVenueResponse = constants_1.VENUE_RESPONSE_SNAP;
jest.mock('../../services/apiClient', () => ({
    apiClient: (type) => __awaiter(void 0, void 0, void 0, function* () {
        if (mockEntityMap[type].API_MODEL_NAME === mockOfferMetasConfig.API_MODEL_NAME) {
            return mockOfferResponse;
        }
        else if (mockEntityMap[type].API_MODEL_NAME === mockVenuMetasConfig.API_MODEL_NAME) {
            return mockVenueResponse;
        }
        throw new Error(`Unknown entity: ${type}`);
    }),
}));
describe('metas utils', () => {
    it(`should replace meta for offer`, () => __awaiter(void 0, void 0, void 0, function* () {
        const newHtml = yield (0, metas_1.replaceHtmlMetas)(constants_1.TEST_HTML, `/offre/${constants_1.OFFER_RESPONSE_SNAP.id}`, 'offre', constants_1.OFFER_RESPONSE_SNAP.id);
        expect(newHtml).toMatchSnapshot();
    }));
    it(`should replace meta for venue`, () => __awaiter(void 0, void 0, void 0, function* () {
        const newHtml = yield (0, metas_1.replaceHtmlMetas)(constants_1.TEST_HTML, `/lieu/${constants_1.VENUE_RESPONSE_SNAP.id}`, 'lieu', constants_1.VENUE_RESPONSE_SNAP.id);
        expect(newHtml).toMatchSnapshot();
    }));
});
