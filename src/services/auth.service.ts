import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const SALT_ROUNDS = 10;
const ACCESS_EXPIRY = '1d';
const REFRESH_EXPIRY = '7d';

export const hashPassword = (pw: string) => bcrypt.hash(pw, SALT_ROUNDS);
export const comparePassword = (pw: string, hash: string) => bcrypt.compare(pw, hash);

export const getMe = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({ where: { id: adminId } });
  if (!admin) throw Object.assign(new Error('User not found'), { status: 404 });
  return { id: admin.id, email: admin.email, role: 'ADMIN' };
};

export const generateTokens = (adminId: string) => {
  const accessToken = jwt.sign(
    { id: adminId, role: 'ADMIN' },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: ACCESS_EXPIRY }
  );
  const refreshToken = jwt.sign(
    { id: adminId, role: 'ADMIN' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: REFRESH_EXPIRY }
  );
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string };

export const login = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await comparePassword(password, admin.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  await prisma.admin.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  const { accessToken, refreshToken } = generateTokens(admin.id);
  return {
    accessToken,
    refreshToken,
    user: { id: admin.id, email: admin.email, role: 'ADMIN' },
  };
};
