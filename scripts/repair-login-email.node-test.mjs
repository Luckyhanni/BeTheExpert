import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describeConfig, EMAIL_CONFIG, repairEmailConfig } from './repair-login-email.mjs';

function mockServer(initial, persist = true) {
  let config = { ...initial };
  const calls = [];
  return { calls, fetcher: async (url, request) => {
    calls.push({ url, ...request });
    if (request.method === 'PATCH' && persist) config = { ...config, ...JSON.parse(request.body) };
    return { ok: true, json: async () => ({ ...config }) };
  } };
}

test('changes only both login templates, subjects and length, then verifies via fresh GET', async () => {
  const server = mockServer({ smtp_host: 'mail.example.org', smtp_pass: 'private', mailer_autoconfirm: false });
  assert.deepEqual(await repairEmailConfig('test-only', { apply: true, fetcher: server.fetcher }), { applied: true });
  assert.deepEqual(server.calls.map((call) => call.method), ['GET', 'PATCH', 'GET']);
  assert.deepEqual(JSON.parse(server.calls[1].body), EMAIL_CONFIG);
  assert.equal(server.calls[0].redirect, 'error');
  assert.equal(new URL(server.calls[0].url).host, 'api.supabase.com');
});
test('read-only mode never changes server configuration', async () => {
  const server = mockServer({});
  await repairEmailConfig('test-only', { fetcher: server.fetcher });
  assert.deepEqual(server.calls.map((call) => call.method), ['GET']);
});
test('an active email hook blocks repair without modifying it', async () => {
  const server = mockServer({ smtp_host: 'smtp', hook_send_email_enabled: true });
  await assert.rejects(repairEmailConfig('test-only', { apply: true, fetcher: server.fetcher }), /Hook/);
  assert.equal(server.calls.length, 1);
});
test('does not claim success if the API does not retain the update', async () => {
  const server = mockServer({ smtp_host: 'smtp' }, false);
  await assert.rejects(repairEmailConfig('test-only', { apply: true, fetcher: server.fetcher }), /nicht vollstaendig/);
});
test('diagnostic output never exposes raw config or secrets', () => {
  const output = JSON.stringify(describeConfig({ smtp_host: 'private-host', smtp_pass: 'private-password', hook_send_email_secrets: 'private-hook', mailer_templates_magic_link_content: 'private-template' }));
  assert.equal(output.includes('private-'), false);
});
