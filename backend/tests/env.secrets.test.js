import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanSecret } from '../src/config/env.js';

test('cleanSecret removes whitespace, line breaks and wrapping quotes', () => {
  for (const raw of ['rzp_test_abc123', ' rzp_test_abc123 ', 'rzp_test_abc123\n', '"rzp_test_abc123"', "'rzp_test_abc123'\r\n"]) {
    assert.equal(cleanSecret(raw), 'rzp_test_abc123', JSON.stringify(raw));
  }
});

test('cleanSecret treats empty or missing values as unset', () => {
  for (const raw of [undefined, '', '   ', '""']) {
    assert.equal(cleanSecret(raw), undefined, JSON.stringify(raw));
  }
});
