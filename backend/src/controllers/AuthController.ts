import { Request, Response } from 'express';
import { UserService } from '../services/UserService.js';
import { MagicLinkService } from '../services/MagicLinkService.js';
import { EmailService } from '../services/EmailService.js';
import { signJWT } from '../lib/jwt.js';
import config from '../lib/config.js';
import type { MagicLinkRequest, MagicLinkVerify } from '../schemas/auth.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

/**
 * 🚨 TEMPORARY DEV-ONLY AUTH BYPASS — REMOVE BEFORE SHIPPING 🚨
 * Exact-match only, one hardcoded email, so Akanksha can test without the
 * email round-trip. Never widen this (no domain match, no env toggle that
 * could be true in prod by accident) — it skips real verification entirely
 * for this one address. Tracked in Deferred.md under "must remove before launch".
 */
const DEV_BYPASS_EMAIL = 'kanjoliaakanksha@gmail.com';

export class AuthController {
  constructor(
    private userService: UserService,
    private magicLinkService: MagicLinkService,
    private emailService: EmailService
  ) {}

  async requestMagicLink(req: Request<{}, {}, MagicLinkRequest>, res: Response): Promise<void> {
    const { email } = req.body;

    // Find or create user
    const user = await this.userService.findOrCreateByEmail(email);

    // 🚨 DEV-ONLY BYPASS — see DEV_BYPASS_EMAIL comment above. Skips the
    // email round-trip entirely for one exact, hardcoded address by issuing
    // a real session token directly in this response.
    if (email === DEV_BYPASS_EMAIL) {
      const jwtToken = signJWT({ userId: user.id });
      res.status(200).json({
        message: 'Dev bypass active for this email — signing in directly.',
        token: jwtToken,
        user: { id: user.id, email: user.email },
      });
      return;
    }

    // Generate magic link token
    const rawToken = await this.magicLinkService.createToken(user.id);

    // Build the magic link URL
    const magicLink = `${config.APP_URL}/auth/verify?token=${rawToken}`;

    // Send magic link via email (Resend)
    // Errors are logged server-side but not thrown to client
    await this.emailService.sendMagicLink(email, magicLink);

    // Always respond with generic success message to avoid email enumeration
    res.status(200).json({
      message: 'If the email exists, a magic link has been sent. Please check your email.',
    });
  }

  async verifyMagicLink(
    token: string,
    res: Response
  ): Promise<void> {

    // Verify the token and get userId
    const userId = await this.magicLinkService.verifyToken(token as string);

    // Get user details
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new Error('User not found after token verification');
    }

    // Issue JWT
    const jwtToken = signJWT({ userId: user.id });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const user = await this.userService.findByIdWithOnboarding(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const stats = await this.userService.getUserStats(userId);

    res.status(200).json({
      id: user.id,
      email: user.email,
      onboarded: user.onboarded ?? false,
      stats,
    });
  }
}
