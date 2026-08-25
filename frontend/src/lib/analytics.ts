import mixpanel from 'mixpanel-browser';
import type { Mixpanel } from 'mixpanel-browser';

/**
 * Analytics wrapper for Mixpanel.
 * Initializes once with the VITE_MIXPANEL_TOKEN environment variable.
 * No-ops safely (with console.warn) if the token is missing.
 * Exports typed API: identify(), track(), reset().
 * Does NOT log PII beyond user ID.
 */

let instance: Mixpanel | null = null;

function getInstanceSafely(): Mixpanel | null {
  if (instance !== null) {
    return instance;
  }

  const token = import.meta.env.VITE_MIXPANEL_TOKEN;
  if (!token) {
    console.warn(
      'Mixpanel token not configured. Set VITE_MIXPANEL_TOKEN to enable analytics.'
    );
    return null;
  }

  try {
    mixpanel.init(token, {
      debug: import.meta.env.DEV,
      // This Mixpanel project uses EU data residency (eu.mixpanel.com) —
      // events must be sent to the EU ingestion endpoint or they won't appear.
      api_host: 'https://api-eu.mixpanel.com',
    });
    instance = mixpanel;
    return instance;
  } catch (error) {
    console.warn('Failed to initialize Mixpanel:', error);
    return null;
  }
}

/**
 * Identify the current user by ID.
 * Call this after a user logs in.
 * @param userId The unique identifier for the user
 * @param props Optional user properties (should not include PII like email or name)
 */
export function identify(userId: string, props?: Record<string, unknown>): void {
  const mp = getInstanceSafely();
  if (!mp) return;

  try {
    mp.identify(userId);
    if (props) {
      mp.people.set(props);
    }
  } catch (error) {
    console.warn('Failed to identify user:', error);
  }
}

/**
 * Track an analytics event.
 * @param event The event name (snake_case)
 * @param props Optional event properties
 */
export function track(event: string, props?: Record<string, unknown>): void {
  const mp = getInstanceSafely();
  if (!mp) return;

  try {
    mp.track(event, props);
  } catch (error) {
    console.warn(`Failed to track event "${event}":`, error);
  }
}

/**
 * Reset the user identity.
 * Call this on logout.
 */
export function reset(): void {
  const mp = getInstanceSafely();
  if (!mp) return;

  try {
    mp.reset();
  } catch (error) {
    console.warn('Failed to reset analytics:', error);
  }
}
