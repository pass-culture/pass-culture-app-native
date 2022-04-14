/// <reference types="node" />
import { IncomingMessage } from 'http';
export declare function metasResponseInterceptor(responseBuffer: Buffer, proxyRes: IncomingMessage, req: IncomingMessage): Promise<string | Buffer>;
export declare const webAppProxyMiddleware: import("http-proxy-middleware").RequestHandler;
