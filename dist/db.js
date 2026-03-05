"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    name: process.env.APP_NAME || 'NestJS App',
    env: process.env.APP_ENV || 'local',
    url: process.env.APP_URL || 'localhost',
    port: process.env.APP_PORT || 5000,
    frontendUrl: process.env.FRONTEND_URI,
}));
