import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOrigin } from '../src/app.js';

test('normalizeOrigin strips quotes, spaces, trailing slashes and case', () => {
  const expected = 'https://www.reikiandvaastuworld.com';
  for (const raw of [
    'https://www.reikiandvaastuworld.com',
    ' https://www.reikiandvaastuworld.com ',
    'https://www.reikiandvaastuworld.com/',
    '"https://www.reikiandvaastuworld.com"',
    "'https://www.reikiandvaastuworld.com/'",
    'HTTPS://WWW.ReikiAndVaastuWorld.com'
  ]) {
    assert.equal(normalizeOrigin(raw), expected, `input: ${raw}`);
  }
});

test('normalizeOrigin keeps different hosts distinct', () => {
  assert.notEqual(
    normalizeOrigin('https://reikiandvaastuworld.com'),
    normalizeOrigin('https://www.reikiandvaastuworld.com')
  );
});

test('production domains are always allowed, even when CORS_ORIGIN omits them', async () => {
  const { default: app, allowedOrigins } = await import('../src/app.js');
  assert.ok(allowedOrigins.includes('https://www.reikiandvaastuworld.com'));
  assert.ok(allowedOrigins.includes('https://reikiandvaastuworld.com'));

  const server = app.listen(0);
  try {
    const { port } = server.address();
    const preflight = (origin) =>
      fetch(`http://127.0.0.1:${port}/api/enquiries`, {
        method: 'OPTIONS',
        headers: {
          Origin: origin,
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'content-type'
        }
      });

    const ok = await preflight('https://www.reikiandvaastuworld.com');
    assert.equal(ok.status, 204);
    assert.equal(ok.headers.get('access-control-allow-origin'), 'https://www.reikiandvaastuworld.com');

    const blocked = await preflight('https://evil.example.com');
    assert.equal(blocked.headers.get('access-control-allow-origin'), null);
  } finally {
    server.close();
  }
});
