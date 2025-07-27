"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const app_const_1 = __importDefault(require("./app.const"));
const sequelizeDB = new sequelize_1.Sequelize(app_const_1.default.mysql.db_name, app_const_1.default.mysql.db_user, app_const_1.default.mysql.db_pass, {
    host: app_const_1.default.mysql.db_host,
    dialect: 'mysql',
    logging: false,
});
exports.default = sequelizeDB;
