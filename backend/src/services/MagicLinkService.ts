import { PrismaClient } from '@prisma/client';
import { generateRandomToken, hashToken } from '../lib/crypto.js';
import { UnauthorizedError } from '../lib/errors.js';

export class MagicLinkService {
  private readonly EXPIRY_MINUTES = 15;

  constructor(private prisma: PrismaClient) {}

  async createToken(userId: string): Promise<string> {
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000);

    await this.prisma.magicLinkToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return rawToken;
  }

  async verifyToken(rawToken: string): Promise<string> {
    const tokenHash = hashToken(rawToken);

    const tokenRecord = await this.prisma.magicLinkToken.findUnique({
      where: { tokenHash },
      select: {
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedError('Invalid token');
    }

    if (tokenRecord.usedAt) {
      throw new UnauthorizedError('Token has already been used');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedError('Token has expired');
    }

    // Mark token as used
    await this.prisma.magicLinkToken.update({
      where: { tokenHash },
      data: { usedAt: new Date() },
    });

    return tokenRecord.userId;
  }
}
