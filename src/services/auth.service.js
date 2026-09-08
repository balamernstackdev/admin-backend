"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.verifyRefreshToken = exports.generateTokens = exports.getMe = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const SALT_ROUNDS = 10;
const ACCESS_EXPIRY = '1d';
const REFRESH_EXPIRY = '7d';
const hashPassword = (pw) => bcrypt_1.default.hash(pw, SALT_ROUNDS);
exports.hashPassword = hashPassword;
const comparePassword = (pw, hash) => bcrypt_1.default.compare(pw, hash);
exports.comparePassword = comparePassword;
const getMe = async (adminId) => {
    const admin = await prisma_1.default.admin.findUnique({ where: { id: adminId } });
    if (!admin)
        throw Object.assign(new Error('User not found'), { status: 404 });
    return { id: admin.id, email: admin.email, role: 'ADMIN' };
};
exports.getMe = getMe;
const generateTokens = (adminId) => {
    const accessToken = jsonwebtoken_1.default.sign({ id: adminId, role: 'ADMIN' }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
    const refreshToken = jsonwebtoken_1.default.sign({ id: adminId, role: 'ADMIN' }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
const verifyRefreshToken = (token) => jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
exports.verifyRefreshToken = verifyRefreshToken;
const login = async (email, password) => {
    const admin = await prisma_1.default.admin.findUnique({ where: { email } });
    if (!admin)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    const valid = await (0, exports.comparePassword)(password, admin.passwordHash);
    if (!valid)
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    await prisma_1.default.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });
    const { accessToken, refreshToken } = (0, exports.generateTokens)(admin.id);
    return {
        accessToken,
        refreshToken,
        user: { id: admin.id, email: admin.email, role: 'ADMIN' },
    };
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map