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
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        coverageThreshold: {
            global: {
                branches: 100,
                functions: 100,
                lines: 100,
                statements: 100,
            },
        },
        setupFiles: ['<rootDir>/jest/jest.setup.ts'],
        setupFilesAfterEnv: ['<rootDir>/jest/jest.setupFilesAfterEnv.ts'],
        testRegex: '.(?:test|spec).(?:tsx?|js)$',
        testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    };
});
