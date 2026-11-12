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
