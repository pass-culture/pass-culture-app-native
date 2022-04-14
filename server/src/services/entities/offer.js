"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFFER = void 0;
const env_1 = require("../../libs/environment/env");
const types_1 = require("./types");
const { DEEPLINK_PROTOCOL } = env_1.env;
exports.OFFER = {
    API_MODEL_NAME: 'offer',
    METAS_CONFIG: {
        title(entity) {
            return entity.name;
        },
        description(entity) {
            return entity.description;
        },
        ['og:url'](entity, href, subPath) {
            return `${href}${subPath}`;
        },
        ['og:title'](entity) {
            return entity.name;
        },
        ['og:description'](entity) {
            return entity.description;
        },
        ['og:image'](entity) {
            var _a;
            return (_a = entity.image) === null || _a === void 0 ? void 0 : _a.url;
        },
        ['og:image:alt'](entity) {
            return entity.name;
        },
        ['twitter:card']() {
            return types_1.TwitterCard.summary;
        },
        ['twitter:url'](entity, href, subPath) {
            return `${href}${subPath}`;
        },
        ['twitter:title'](entity) {
            return entity.name;
        },
        ['twitter:description'](entity) {
            return entity.description;
        },
        ['twitter:image'](entity) {
            var _a;
            return (_a = entity.image) === null || _a === void 0 ? void 0 : _a.url;
        },
        ['twitter:image:alt'](entity) {
            return entity.name;
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
