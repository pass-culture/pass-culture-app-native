"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VENUE = void 0;
const env_1 = require("../../libs/environment/env");
const types_1 = require("./types");
const { DEEPLINK_PROTOCOL } = env_1.env;
exports.VENUE = {
    API_MODEL_NAME: 'venue',
    METAS_CONFIG: {
        title(entity) {
            return (entity.publicName || entity.name);
        },
        description(entity) {
            return entity.description;
        },
        ['og:url'](entity, href, subPath) {
            return `${href}${subPath}`;
        },
        ['og:title'](entity) {
            return (entity.publicName || entity.name);
        },
        ['og:description'](entity) {
            return entity.description;
        },
        ['og:image'](entity) {
            return entity.bannerUrl;
        },
        ['og:image:alt'](entity) {
            return entity.description;
        },
        ['twitter:card']() {
            return types_1.TwitterCard.summaryLargeImage;
        },
        ['twitter:url'](entity, href, subPath) {
            return `${href}${subPath}`;
        },
        ['twitter:title'](entity) {
            return (entity.publicName || entity.name);
        },
        ['twitter:description'](entity) {
            return entity.description;
        },
        ['twitter:image'](entity) {
            return entity.bannerUrl;
        },
        ['twitter:image:alt'](entity) {
            var _a;
            return (((_a = entity.bannerMeta) === null || _a === void 0 ? void 0 : _a.image_credit) ||
                entity.description);
        },
        ['twitter:app:url:iphone'](entity, href, subPath) {
            return `${DEEPLINK_PROTOCOL}${href}${subPath}`;
        },
        ['twitter:app:url:ipad'](entity, href, subPath) {
            return `${DEEPLINK_PROTOCOL}${href}${subPath}`;
        },
        ['twitter:app:url:googleplay'](entity, href, subPath) {
            return `${DEEPLINK_PROTOCOL}${href}${subPath}`;
        },
        ['al:ios:url'](entity, href, subPath) {
            return `${DEEPLINK_PROTOCOL}${href}${subPath}`;
        },
        ['al:android:url'](entity, href, subPath) {
            return `${DEEPLINK_PROTOCOL}${href}${subPath}`;
        },
    },
};
