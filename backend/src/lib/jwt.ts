import jwt from 'jsonwebtoken';
import config from './config.js';

export interface JWTPayload {
  userId: string;
}

export function signJWT(payload: JWTPayload, expiresIn: string = '7d'): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyJWT(token: string): JWTPayload {
  return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
}
