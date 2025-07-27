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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("../config/db.config"));
require("../models/message.model");
function migration() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db_config_1.default.authenticate();
            console.log('Connection OK');
            console.log('Models registered:', Object.keys(db_config_1.default.models));
            yield db_config_1.default.sync({ alter: true });
            console.log('Sync complete');
        }
        catch (err) {
            console.error('Error:', err);
        }
        finally {
            yield db_config_1.default.close();
        }
    });
}
migration();
