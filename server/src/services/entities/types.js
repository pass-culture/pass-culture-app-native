"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterCard = exports.ENTITY_METAS_CONFIG_MAP = exports.ENTITY_MAP = void 0;
const offer_1 = require("./offer");
const venue_1 = require("./venue");
exports.ENTITY_MAP = {
    offre: offer_1.OFFER,
    lieu: venue_1.VENUE,
};
exports.ENTITY_METAS_CONFIG_MAP = {
    offre: offer_1.OFFER.METAS_CONFIG,
    lieu: venue_1.VENUE.METAS_CONFIG,
};
var TwitterCard;
(function (TwitterCard) {
    TwitterCard["app"] = "app";
    TwitterCard["summary"] = "summary";
    TwitterCard["summaryLargeImage"] = "summary_large_image";
})(TwitterCard = exports.TwitterCard || (exports.TwitterCard = {}));
