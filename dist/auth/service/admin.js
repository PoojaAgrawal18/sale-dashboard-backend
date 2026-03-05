"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("@app/user/constants");
const constants_2 = require("../constants");
const utils_1 = require("@app/_common/utils");
let AuthAdminService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthAdminService = _classThis = class {
        constructor(evClientDetails, credentialingClient, teamRolePermissionRepository, adminLogin, adminDetails, jwtService, bncUserDetails) {
            this.evClientDetails = evClientDetails;
            this.credentialingClient = credentialingClient;
            this.teamRolePermissionRepository = teamRolePermissionRepository;
            this.adminLogin = adminLogin;
            this.adminDetails = adminDetails;
            this.jwtService = jwtService;
            this.bncUserDetails = bncUserDetails;
        }
        async login(payload) {
            const loginDetails = await this.adminLogin.findUnique({
                where: {
                    username: payload.username,
                },
            });
            if (!loginDetails) {
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            // Rate limiting: Check login attempts before processing
            const loginAttemptKey = `${constants_2.RATE_LIMIT_KEYS.ADMIN_LOGIN}${loginDetails.id}`;
            const rateLimitConfig = {
                maxAttempts: constants_2.RATE_LIMIT_CONFIG.ADMIN_LOGIN.MAX_ATTEMPTS,
                windowSeconds: constants_2.RATE_LIMIT_CONFIG.ADMIN_LOGIN.WINDOW_SECONDS,
                cooldownSeconds: constants_2.RATE_LIMIT_CONFIG.ADMIN_LOGIN.COOLDOWN_SECONDS,
                errorMessage: 'Too many login attempts. Please try again in a moment.',
            };
            // Check if rate limit is exceeded (throws exception if so)
            await utils_1.Utils.checkRateLimit(loginAttemptKey, rateLimitConfig);
            // Verify password
            const secretMatch = await utils_1.Utils.comparePassword(payload.password, loginDetails.password);
            if (!secretMatch) {
                // Record failed attempt
                await utils_1.Utils.recordFailedAttempt(loginAttemptKey, rateLimitConfig);
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.PASSWORD_MISMATCH, common_1.HttpStatus.BAD_REQUEST);
            }
            // Login successful: clear rate limit counter
            await utils_1.Utils.clearRateLimit(loginAttemptKey);
            const adminDetails = await this.adminDetails.findUnique({
                where: {
                    adminLoginId: loginDetails.id,
                },
            });
            const tokenPayload = {
                sub: adminDetails.uuid,
                username: payload.username,
                type: constants_1.MODULE_CONST.USER_TYPE.ADMIN,
            };
            return {
                tokens: {
                    accessToken: this.jwtService.sign(tokenPayload),
                    refreshToken: null,
                },
                user: {
                    ...adminDetails,
                },
            };
        }
        async credentialingLogin(payload) {
            const { email, password } = payload;
            const clientDetails = await this.credentialingClient.findFirst({
                where: {
                    status: 1,
                    isDeleted: false,
                    OR: [{ to: { has: email } }, { cc: { has: email } }],
                },
            });
            if (!clientDetails) {
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            if (clientDetails.status !== 1) {
                throw new common_1.BadRequestException('Your account is temporarily disabled!');
            }
            // Rate limiting: Check login attempts before processing
            const loginAttemptKey = `${constants_2.RATE_LIMIT_KEYS.CREDENTIALING_LOGIN}${clientDetails.id}`;
            const rateLimitConfig = {
                maxAttempts: constants_2.RATE_LIMIT_CONFIG.CREDENTIALING_LOGIN.MAX_ATTEMPTS,
                windowSeconds: constants_2.RATE_LIMIT_CONFIG.CREDENTIALING_LOGIN.WINDOW_SECONDS,
                cooldownSeconds: constants_2.RATE_LIMIT_CONFIG.CREDENTIALING_LOGIN.COOLDOWN_SECONDS,
                errorMessage: 'Too many login attempts. Please try again in a moment.',
            };
            // Check if rate limit is exceeded (throws exception if so)
            await utils_1.Utils.checkRateLimit(loginAttemptKey, rateLimitConfig);
            const normalizedEmail = email.trim().toLowerCase();
            const storedPassword = clientDetails.extraData?.passwords?.[normalizedEmail];
            const trimmedPassword = password.trim();
            const isPasswordValid = (storedPassword && (await utils_1.Utils.comparePassword(trimmedPassword, storedPassword))) ||
                `${clientDetails.clientId}` === password;
            if (!isPasswordValid) {
                // Record failed attempt
                await utils_1.Utils.recordFailedAttempt(loginAttemptKey, rateLimitConfig);
                throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            // Login successful: clear rate limit counter
            await utils_1.Utils.clearRateLimit(loginAttemptKey);
            await this.credentialingClient.update(clientDetails.id, { lastLogin: new Date() });
            const tokenPayload = {
                sub: clientDetails.uuid,
                username: clientDetails.clientName,
                type: constants_1.MODULE_CONST.USER_TYPE.CREDENTIALING_CLIENT,
            };
            return {
                tokens: {
                    accessToken: this.jwtService.sign(tokenPayload),
                    refreshToken: null,
                },
                client: {
                    ...clientDetails,
                },
            };
        }
        async evClientLogin(payload) {
            const client = await this.evClientDetails.findFirst({
                where: {
                    clientEmail: payload.email,
                },
            });
            if (!client) {
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            if (client.status !== 1)
                throw new common_1.BadRequestException('Your account is temporarily disbaled!');
            // Rate limiting: Check login attempts before processing
            const loginAttemptKey = `${constants_2.RATE_LIMIT_KEYS.EV_CLIENT_LOGIN}${client.id}`;
            const rateLimitConfig = {
                maxAttempts: constants_2.RATE_LIMIT_CONFIG.EV_CLIENT_LOGIN.MAX_ATTEMPTS,
                windowSeconds: constants_2.RATE_LIMIT_CONFIG.EV_CLIENT_LOGIN.WINDOW_SECONDS,
                cooldownSeconds: constants_2.RATE_LIMIT_CONFIG.EV_CLIENT_LOGIN.COOLDOWN_SECONDS,
                errorMessage: 'Too many login attempts. Please try again in a moment.',
            };
            // Check if rate limit is exceeded (throws exception if so)
            await utils_1.Utils.checkRateLimit(loginAttemptKey, rateLimitConfig);
            const secretMatch = (await utils_1.Utils.comparePassword(payload.password, client.password)) ||
                `${client.clientId}_${process.env.VERISURE_PASSWORD_SALT}` === payload.password;
            if (!secretMatch) {
                // Record failed attempt
                await utils_1.Utils.recordFailedAttempt(loginAttemptKey, rateLimitConfig);
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.BAD_REQUEST);
            }
            // Login successful: clear rate limit counter
            await utils_1.Utils.clearRateLimit(loginAttemptKey);
            const tokenPayload = {
                sub: client.uuid,
                username: client.clientName,
                type: constants_1.MODULE_CONST.USER_TYPE.EV_CLIENT,
            };
            return {
                tokens: {
                    accessToken: this.jwtService.sign(tokenPayload),
                    refreshToken: null,
                },
                client: {
                    ...client,
                },
            };
        }
        // Ext Credentialing Login
        async extCredentialingLogin(payload) {
            const loginDetails = await this.adminLogin.findUnique({
                where: {
                    username: payload.username,
                },
                include: {
                    Role: {
                        include: { permission: true },
                    },
                },
            });
            if (!loginDetails) {
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            // Rate limiting: Check login attempts before processing
            const loginAttemptKey = `${constants_2.RATE_LIMIT_KEYS.EXT_CREDENTIALING_LOGIN}${loginDetails.id}`;
            const rateLimitConfig = {
                maxAttempts: constants_2.RATE_LIMIT_CONFIG.EXT_CREDENTIALING_LOGIN.MAX_ATTEMPTS,
                windowSeconds: constants_2.RATE_LIMIT_CONFIG.EXT_CREDENTIALING_LOGIN.WINDOW_SECONDS,
                cooldownSeconds: constants_2.RATE_LIMIT_CONFIG.EXT_CREDENTIALING_LOGIN.COOLDOWN_SECONDS,
                errorMessage: 'Too many login attempts. Please try again in a moment.',
            };
            // Check if rate limit is exceeded (throws exception if so)
            await utils_1.Utils.checkRateLimit(loginAttemptKey, rateLimitConfig);
            const secretMatch = await utils_1.Utils.comparePassword(payload.password, loginDetails.password);
            if (!secretMatch) {
                // Record failed attempt
                await utils_1.Utils.recordFailedAttempt(loginAttemptKey, rateLimitConfig);
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.PASSWORD_MISMATCH, common_1.HttpStatus.BAD_REQUEST);
            }
            // Login successful: clear rate limit counter
            await utils_1.Utils.clearRateLimit(loginAttemptKey);
            const scopeArray = [];
            const adminDetails = await this.adminDetails.findUnique({
                where: {
                    adminLoginId: loginDetails.id,
                },
                include: { PermissionAliases: { include: { permissions: true } } },
            });
            // Adding Team - Role based permissions
            if (adminDetails?.teamDetailsId) {
                const teamsPermissions = await this.teamRolePermissionRepository.findFirst({
                    where: {
                        roleId: loginDetails.Role.id,
                        teamId: adminDetails.teamDetailsId,
                    },
                    include: { permissions: true },
                });
                const permissions = teamsPermissions?.permissions || [];
                for (let i = 0; i < permissions?.length; i++) {
                    scopeArray.push(permissions[i].scope);
                }
            }
            // Adding Role based permissions
            const rolePermissions = loginDetails.Role?.permission || [];
            for (let i = 0; i < rolePermissions?.length; i++) {
                scopeArray.push(rolePermissions[i].scope);
            }
            // Adding Alias based permissions
            if (adminDetails?.PermissionAliases?.length > 0) {
                const permissions = adminDetails?.PermissionAliases?.flatMap((alias) => alias.permissions) || [];
                for (let i = 0; i < permissions.length; i++) {
                    scopeArray.push(permissions[i].scope);
                }
            }
            if (!scopeArray.includes(constants_2.MODULE_CONST.PERMISSIONS.EXT_CREDENTIALING_LOGIN))
                throw new common_1.BadRequestException('You dont have permissions to log in');
            const tokenPayload = {
                sub: adminDetails.uuid,
                username: payload.username,
                type: constants_1.MODULE_CONST.USER_TYPE.ADMIN,
            };
            return {
                tokens: {
                    accessToken: this.jwtService.sign(tokenPayload),
                    refreshToken: null,
                },
                user: {
                    ...adminDetails,
                },
            };
        }
        async bncClientLogin(payload) {
            const client = await this.bncUserDetails.findFirst({
                where: {
                    clientEmail: payload.email,
                },
            });
            if (!client) {
                throw new common_1.HttpException(constants_1.MODULE_CONST.ERROR_MSGS.USER_NOT_FOUND, common_1.HttpStatus.BAD_REQUEST);
            }
            if (client.status !== 1)
                throw new common_1.BadRequestException('Your account is temporarily disbaled!');
            if (payload.password !== client.clientId) {
                throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.BAD_REQUEST);
            }
            const tokenPayload = {
                sub: client.uuid,
                username: client.clientName,
                type: constants_1.MODULE_CONST.USER_TYPE.BNC_CLIENT,
            };
            return {
                message: 'Login successful',
                success: true,
                tokens: {
                    accessToken: this.jwtService.sign(tokenPayload),
                    refreshToken: null,
                },
                client: {
                    ...client,
                },
            };
        }
    };
    __setFunctionName(_classThis, "AuthAdminService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthAdminService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthAdminService = _classThis;
})();
exports.AuthAdminService = AuthAdminService;
