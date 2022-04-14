"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const msw_1 = require("msw");
const node_1 = require("msw/node");
const env_1 = require("../src/libs/environment/env");
const constants_1 = require("./constants");
exports.server = (0, node_1.setupServer)(
// offer
msw_1.rest.get(`${env_1.env.API_BASE_URL}/${env_1.env.API_BASE_PATH_NATIVE_V1}/offer/${constants_1.OFFER_RESPONSE_SNAP.id}`, (req, res, ctx) => res(ctx.status(200), ctx.json(constants_1.OFFER_RESPONSE_SNAP))), 
// 404 offer
msw_1.rest.get(`${env_1.env.API_BASE_URL}/${env_1.env.API_BASE_PATH_NATIVE_V1}/offer/0`, (req, res, ctx) => res(ctx.status(404))), 
// venue
msw_1.rest.get(`${env_1.env.API_BASE_URL}/${env_1.env.API_BASE_PATH_NATIVE_V1}/venue/${constants_1.VENUE_RESPONSE_SNAP.id}`, (req, res, ctx) => res(ctx.status(200), ctx.json(constants_1.VENUE_RESPONSE_SNAP))), 
// venue alternative
msw_1.rest.get(`${env_1.env.API_BASE_URL}/${env_1.env.API_BASE_PATH_NATIVE_V1}/venue/${constants_1.VENUE_RESPONSE_ALTERNATIVE_SNAP.id}`, (req, res, ctx) => res(ctx.status(200), ctx.json(constants_1.VENUE_RESPONSE_ALTERNATIVE_SNAP))));
