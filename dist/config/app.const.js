"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const dbName = (_a = process.env.DB_DATABASE) !== null && _a !== void 0 ? _a : '';
const dbPrefix = `\`${dbName}\``;
const appConst = {
    app: {
        app_url: (_b = process.env.APP_URL) !== null && _b !== void 0 ? _b : '',
        app_name: (_c = process.env.APP_NAME) !== null && _c !== void 0 ? _c : 'prowhats_chat',
    },
    mysql: {
        db_name: dbName,
        db_user: (_d = process.env.DB_USERNAME) !== null && _d !== void 0 ? _d : '',
        db_pass: (_e = process.env.DB_PASSWORD) !== null && _e !== void 0 ? _e : '',
        db_host: (_f = process.env.DB_HOST) !== null && _f !== void 0 ? _f : 'localhost',
    },
    redis: {
        host: (_g = process.env.REDIS_HOST) !== null && _g !== void 0 ? _g : '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASS || undefined,
    }
};
exports.default = appConst;
