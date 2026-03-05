"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminController = void 0;
const core_1 = require("@libs/core");
const common_1 = require("@nestjs/common");
const auth_1 = require("@app/transformer/auth");
const details_1 = require("@app/transformer/credentialing/details");
const details_2 = require("@app/transformer/ev-client/details");
const decorators_1 = require("@app/audit/decorators");
const details_3 = require("@app/transformer/b-n-c-client/details");
let AuthAdminController = (() => {
    let _classDecorators = [(0, decorators_1.SkipAudit)(), (0, decorators_1.SkipRateLimit)(), (0, common_1.Controller)('admin/auth')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = core_1.RestController;
    let _instanceExtraInitializers = [];
    let _login_decorators;
    let _credentialingLogin_decorators;
    let _evClientLogin_decorators;
    let _extCredentialingLogin_decorators;
    let _bncClientLogin_decorators;
    var AuthAdminController = _classThis = class extends _classSuper {
        constructor(adminService) {
            super();
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        async login(res, validated) {
            const response = await this.adminService.login(validated);
            return res.success(await this.transform(response, new auth_1.AuthDetailsTransformer(), { response }));
        }
        async credentialingLogin(res, payload) {
            const response = await this.adminService.credentialingLogin(payload);
            return res.success(await this.transform(response, new details_1.CredentialingLoginTransformer(), { response }));
        }
        async evClientLogin(res, payload) {
            const response = await this.adminService.evClientLogin(payload);
            return res.success(await this.transform(response, new details_2.EvClientLoginTransformer(), { response }));
        }
        async extCredentialingLogin(res, payload) {
            const response = await this.adminService.extCredentialingLogin(payload);
            return res.success(await this.transform(response, new auth_1.AuthDetailsTransformer(), { response }));
        }
        async bncClientLogin(res, payload) {
            const response = await this.adminService.bncClientLogin(payload);
            return res.success(await this.transform(response, new details_3.BncClientLoginTransformer(), { response }));
        }
    };
    __setFunctionName(_classThis, "AuthAdminController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _login_decorators = [(0, decorators_1.SkipRateLimit)(), (0, decorators_1.SkipAudit)(), (0, common_1.Post)('/login')];
        _credentialingLogin_decorators = [(0, decorators_1.SkipRateLimit)(), (0, decorators_1.SkipAudit)(), (0, common_1.Post)('/credentialing/login')];
        _evClientLogin_decorators = [(0, decorators_1.SkipRateLimit)(), (0, decorators_1.SkipAudit)(), (0, common_1.Post)('/ev/login')];
        _extCredentialingLogin_decorators = [(0, decorators_1.SkipRateLimit)(), (0, decorators_1.SkipAudit)(), (0, common_1.Post)('/credentialing/ext/login')];
        _bncClientLogin_decorators = [(0, common_1.Post)('/bnc/login')];
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: obj => "login" in obj, get: obj => obj.login }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _credentialingLogin_decorators, { kind: "method", name: "credentialingLogin", static: false, private: false, access: { has: obj => "credentialingLogin" in obj, get: obj => obj.credentialingLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _evClientLogin_decorators, { kind: "method", name: "evClientLogin", static: false, private: false, access: { has: obj => "evClientLogin" in obj, get: obj => obj.evClientLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _extCredentialingLogin_decorators, { kind: "method", name: "extCredentialingLogin", static: false, private: false, access: { has: obj => "extCredentialingLogin" in obj, get: obj => obj.extCredentialingLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _bncClientLogin_decorators, { kind: "method", name: "bncClientLogin", static: false, private: false, access: { has: obj => "bncClientLogin" in obj, get: obj => obj.bncClientLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthAdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthAdminController = _classThis;
})();
exports.AuthAdminController = AuthAdminController;
