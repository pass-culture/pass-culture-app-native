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
exports.replaceHtmlMetas = void 0;
const env_1 = require("../libs/environment/env");
const apiClient_1 = require("../services/apiClient");
const types_1 = require("../services/entities/types");
const { APP_PUBLIC_URL } = env_1.env;
const { href } = new URL(APP_PUBLIC_URL);
function replaceHtmlMetas(html, endpoint, type, entityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const entity = yield (0, apiClient_1.apiClient)(type, entityId);
        const subPath = endpoint.slice(1);
        const METAS_CONFIG = types_1.ENTITY_METAS_CONFIG_MAP[type];
        const metaConfig = {
            title: {
                data: METAS_CONFIG.title(entity),
                regEx: /<meta\s(name)="(title)"\scontent="([^"]*)"\s*\/?>/g,
            },
            description: {
                data: METAS_CONFIG.description(entity),
                regEx: /<meta\s(name)="(description)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['og:url']: {
                data: METAS_CONFIG['og:url'](entity, href, subPath),
                regEx: /<meta\s(property)="(og:url)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['og:title']: {
                data: METAS_CONFIG['og:title'](entity),
                regEx: /<meta\s(property)="(og:title)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['og:description']: {
                data: METAS_CONFIG['og:description'](entity),
                regEx: /<meta\s(property)="(og:description)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['og:image']: {
                data: METAS_CONFIG['og:image'](entity),
                regEx: /<meta\s(property)="(og:image)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['og:image:alt']: {
                data: METAS_CONFIG['og:image:alt'](entity),
                regEx: /<meta\s(property)="(og:image:alt)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:card']: {
                data: METAS_CONFIG['twitter:card'](),
                regEx: /<meta\s(name)="(twitter:card)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:url']: {
                data: METAS_CONFIG['twitter:url'](entity, href, subPath),
                regEx: /<meta\s(name)="(twitter:url)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:title']: {
                data: METAS_CONFIG['twitter:title'](entity),
                regEx: /<meta\s(name)="(twitter:title)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:description']: {
                data: METAS_CONFIG['twitter:description'](entity),
                regEx: /<meta\s(name)="(twitter:description)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:image']: {
                data: METAS_CONFIG['twitter:image'](entity),
                regEx: /<meta\s(name)="(twitter:image)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:image:alt']: {
                data: METAS_CONFIG['twitter:image:alt'](entity),
                regEx: /<meta\s(name)="(twitter:image:alt)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:app:url:iphone']: {
                data: METAS_CONFIG['twitter:app:url:iphone'](entity, href, subPath),
                regEx: /<meta\s(name)="(twitter:app:url:iphone)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:app:url:ipad']: {
                data: METAS_CONFIG['twitter:app:url:ipad'](entity, href, subPath),
                regEx: /<meta\s(name)="(twitter:app:url:ipad)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['twitter:app:url:googleplay']: {
                data: METAS_CONFIG['twitter:app:url:googleplay'](entity, href, subPath),
                regEx: /<meta\s(name)="(twitter:app:url:googleplay)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['al:ios:url']: {
                data: METAS_CONFIG['al:ios:url'](entity, href, subPath),
                regEx: /<meta\s(name)="(al:ios:url)"\scontent="([^"]*)"\s*\/?>/g,
            },
            ['al:android:url']: {
                data: METAS_CONFIG['al:android:url'](entity, href, subPath),
                regEx: /<meta\s(name)="(al:android:url)"\scontent="([^"]*)"\s*\/?>/g,
            },
        };
        Object.values(metaConfig).forEach(({ regEx, data }) => {
            if (data) {
                html = html.replace(regEx, `<meta $1="$2" content="${data}" />`);
            }
        });
        return html;
    });
}
exports.replaceHtmlMetas = replaceHtmlMetas;
