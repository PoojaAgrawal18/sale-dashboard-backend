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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const strategies_1 = require("./strategies");
const controller_1 = require("./controller");
const service_1 = require("./service");
const passport_1 = require("@nestjs/passport");
const constants_1 = require("@app/user/constants");
const db_1 = require("@app/user/db");
const db_2 = require("@app/rbac/db");
const constants_2 = require("@app/rbac/constants");
const credentialing_1 = require("@app/credentialing");
const db_3 = require("@app/credentialing/db");
const prisma_1 = require("@libs/core/prisma");
const bnc_google_strategy_1 = require("./strategies/bnc.google.strategy");
let AuthModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                passport_1.PassportModule.register({ session: false }),
                jwt_1.JwtModule.registerAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: async (configService) => ({
                        secret: configService.get('settings.jwt.secret'),
                        signOptions: { expiresIn: configService.get('settings.jwt.ttl') },
                    }),
                    inject: [config_1.ConfigService],
                }),
                config_1.ConfigModule, // Add this explicitly
            ],
            controllers: [controller_1.AuthAdminController, controller_1.AuthUserController, controller_1.GoogleAuthController],
            providers: [
                prisma_1.PostgreSQLConnector,
                strategies_1.JwtStrategy,
                service_1.AuthAdminService,
                strategies_1.GoogleStrategy,
                strategies_1.EvGoogleStrategy,
                strategies_1.InsuranceLookupGoogleStrategy,
                strategies_1.CredentialingGoogleStrategy,
                service_1.AuthUserService,
                service_1.AuthGoogleService,
                service_1.AuthGoogleService,
                strategies_1.FormBoxGoogleStrategy,
                strategies_1.ExtCredentialingGoogleStrategy,
                strategies_1.ExtEvGoogleStrategy,
                strategies_1.IvFormGoogleStrategy,
                bnc_google_strategy_1.BncGoogleStrategy,
                {
                    provide: constants_1.USER_REPOSITORY.ADMIN_LOGIN,
                    useClass: db_1.AdminLoginRepository,
                },
                {
                    provide: credentialing_1.CREDENTIALING_REPOSITORY.CREDENTIALING_CLIENT,
                    useClass: db_3.CredentialingClientRepository,
                },
                {
                    provide: constants_1.USER_REPOSITORY.ADMIN_DETAIL,
                    useClass: db_1.AdminDetailsRepository,
                },
                {
                    provide: constants_2.RBAC_REPOSITORY.TEAM_ROLE_PERMISSION_REPOSITORY,
                    useClass: db_2.TeamRolePermissionRepository,
                },
                {
                    provide: constants_2.RBAC_REPOSITORY.ROLE_REPOSITORY,
                    useClass: db_2.RoleRepository,
                },
            ],
            exports: [strategies_1.JwtStrategy, service_1.AuthAdminService, service_1.AuthUserService, service_1.AuthGoogleService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthModule = _classThis = class {
    };
    __setFunctionName(_classThis, "AuthModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthModule = _classThis;
})();
exports.AuthModule = AuthModule;
