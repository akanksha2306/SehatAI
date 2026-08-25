import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { hashToken } from '../lib/crypto.js';
import { UnauthorizedError } from '../lib/errors.js';

export class MagicLinkService {
  private readonly EXPIRY_MINUTES = 15;
  private readonly MAX_RETRIES = 3;

  constructor(private prisma: PrismaClient) {}

  async createToken(userId: string): Promise<string> {
    // Generate a 6-digit numeric code
    let rawToken: string;
    let tokenHash: string;

    // Retry up to MAX_RETRIES times in case of collision (unlikely but possible with 6-digit space)
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      rawToken = crypto.randomInt(100000, 999999).toString();
      tokenHash = hashToken(rawToken);

      try {
        const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000);

        await this.prisma.magicLinkToken.create({
          data: {
            userId,
            tokenHash,
            expiresAt,
          },
        });

        return rawToken;
      } catch (error) {
        // Check if it's a unique constraint violation
        if (error instanceof Error && error.message.includes('Unique constraint failed')) {
          if (attempt === this.MAX_RETRIES - 1) {
            // Last attempt failed, throw error
            throw new Error('Failed to generate unique verification code after retries');
          }
          // Continue to next retry
          continue;
        }
        // Any other error, rethrow immediately
        throw error;
      }
    }

    throw new Error('Failed to generate unique verification code');
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
