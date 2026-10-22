import { describe, expect, it } from 'vitest';
import { signSessionToken, verifySessionToken } from '../dashboard-session';

describe('dashboard-session', () => {
  const secret = 'test_secret_value_min_16';

  it('signs and verifies a session token', async () => {
    const token = await signSessionToken(secret);
    expect(await verifySessionToken(token, secret)).toBe(true);
  });

  it('rejects tampered tokens', async () => {
    const token = await signSessionToken(secret);
    const tampered = token.slice(0, -4) + 'xxxx';
    expect(await verifySessionToken(tampered, secret)).toBe(false);
  });

  it('rejects wrong secret', async () => {
    const token = await signSessionToken(secret);
    expect(await verifySessionToken(token, 'wrong_secret_value_min_16')).toBe(false);
  });
});
