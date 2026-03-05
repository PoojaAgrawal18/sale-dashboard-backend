"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_KEYS = exports.RATE_LIMIT_CONFIG = exports.MODULE_CONST = void 0;
exports.MODULE_CONST = {
    PERMISSIONS: {
        EXT_EV_LOGIN: 'admin:extEvLogin',
        EXT_CREDENTIALING_LOGIN: 'admin:extCredentialingLogin',
        INSURANCE_LOOKUP_LOGIN: 'admin:insuranceLoginLookup',
        CREDENTIALING_LOGIN: 'admin:credentialingLookup',
    },
    USER_TYPE: {
        USER: 'user',
        ADMIN: 'admin',
    },
    ROUTES: {
        USER: {
            BASE_PATH: 'users/auth',
            VERIFY_MOBILE: '/verify-mobile',
            REQUEST_OTP: '/request-otp',
            VERIFY_OTP: '/verify-otp',
        },
        ADMIN: {
            BASE_PATH: 'admin/auth',
            LOGIN: '/login',
        },
    },
    ERROR_MSGS: {
        IS_STRING: 'Invalid :key',
        IS_NOT_EMPTY: ':key must not be empty',
        PASSWORD_LENGTH: 'Length of password must be greater than 8',
        OTP_LENGTH: 'Length of password must be equal to 6',
        PASSWORD_MISMATCH: 'Username or password invalid',
    },
    EVENTS: {
        SEND_OTP: 'send-otp',
    },
};
exports.RATE_LIMIT_CONFIG = {
    // Default rate limit settings (5 attempts per 60 seconds)
    // Incremental cooldown: 5min (1st hit), 10min (2nd), 20min (3rd), 30min (4th), 60min (5th+), capped at 60min
    DEFAULT: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
        // incrementalCooldown: true (default), maxCooldownSeconds: 3600 (default: 60 minutes)
    },
    // Admin login rate limit
    ADMIN_LOGIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
    // Credentialing client login rate limit
    CREDENTIALING_LOGIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
    // EV client login rate limit
    EV_CLIENT_LOGIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
    // Ext credentialing login rate limit
    EXT_CREDENTIALING_LOGIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
    // Insurance lookup admin login rate limit
    INSURANCE_LOOKUP_ADMIN: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
    // Insurance lookup user login rate limit
    INSURANCE_LOOKUP_USER: {
        MAX_ATTEMPTS: 5,
        WINDOW_SECONDS: 60,
        COOLDOWN_SECONDS: 300, // Base cooldown: 5 minutes (incremental cooldown enabled by default)
    },
};
/**
 * Redis keys for rate limiting attempts
 */
exports.RATE_LIMIT_KEYS = {
    ADMIN_LOGIN: 'user:login:attempt:',
    CREDENTIALING_LOGIN: 'credentialing:login:attempt:',
    EV_CLIENT_LOGIN: 'ev:client:login:attempt:',
    EXT_CREDENTIALING_LOGIN: 'ext:credentialing:login:attempt:',
    INSURANCE_LOOKUP_ADMIN: 'insurance:lookup:admin:login:attempt:',
    INSURANCE_LOOKUP_USER: 'insurance:lookup:user:login:attempt:',
};
