const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET     = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

class AuthService {
  static async register({ name, email, password }) {
    const exists = await prisma.user.findUnique({
      where: { email }
    });
    if (exists) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  static async authenticate({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, token };
  }
  static verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = AuthService;
