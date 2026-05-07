const bcrypt = require('bcryptjs');
const prisma = require('../db/prisma');
const { signToken } = require('../utils/jwt');

const ALLOWED_ROLES = ['STUDENT', 'TEACHER', 'ADMIN'];

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

function toSafeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function validateSignupInput({ name, email, password }) {
  if (!name || !email || !password) {
    return 'Vui lòng nhập đầy đủ tên, email và mật khẩu';
  }

  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return null;
}

function validateLoginInput({ email, password }) {
  if (!email || !password) {
    return 'Vui lòng nhập email và mật khẩu';
  }

  return null;
}

async function signup({ name, email, password, role }) {
  const validationError = validateSignupInput({ name, email, password });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    const error = new Error('Email đã được sử dụng');
    error.statusCode = 409;
    throw error;
  }

  const normalizedRole = role ? role.toUpperCase() : 'STUDENT';

  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    const error = new Error('Vai trò tài khoản không hợp lệ');
    error.statusCode = 400;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: normalizedRole,
    },
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toSafeUser(user),
    token,
  };
}

async function login({ email, password }) {
  const validationError = validateLoginInput({ email, password });

  if (validationError) {
    const error = new Error(validationError);
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Tài khoản đã bị khóa');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error('Email hoặc mật khẩu không chính xác');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: toSafeUser(user),
    token,
  };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return null;
  }

  return toSafeUser(user);
}

module.exports = {
  signup,
  login,
  getUserById,
  toSafeUser,
};