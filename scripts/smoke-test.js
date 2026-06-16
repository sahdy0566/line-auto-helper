import { spawn } from 'node:child_process';

const port = String(3200 + (process.pid % 1000));
const baseUrl = `http://127.0.0.1:${port}`;
const adminToken = 'smoke-test-admin-token';

const child = spawn(process.execPath, ['src/server.js'], {
  env: {
    ...process.env,
    PORT: port,
    NODE_ENV: 'test',
    LOG_LEVEL: 'error',
    LINE_CHANNEL_ACCESS_TOKEN: 'smoke-test-line-token',
    LINE_CHANNEL_SECRET: 'smoke-test-line-secret',
    ADMIN_TOKEN: adminToken
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';

child.stdout.on('data', (chunk) => {
  stdout += chunk;
});

child.stderr.on('data', (chunk) => {
  stderr += chunk;
});

try {
  await waitForServer();

  await expectJson('/', 200, (body) => body.ok === true && body.webhook === '/webhook');
  await expectJson('/healthz', 200, (body) => body.ok === true);
  await expectJson('/readyz', 200, (body) => body.ok === true && body.activeRuleCount > 0);
  await expectJson('/admin/metrics', 401, (body) => body.ok === false);
  await expectJson('/admin/metrics', 200, (body) => body.ok === true, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  await expectJson('/admin/broadcast', 400, (body) => body.ok === false, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  console.log(`Smoke test passed against ${baseUrl}`);
} finally {
  child.kill();
}

async function waitForServer() {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Server exited early with code ${child.exitCode}\n${stdout}\n${stderr}`);
    }

    try {
      const response = await fetch(`${baseUrl}/healthz`);

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  throw new Error(`Server did not become ready at ${baseUrl}\n${stdout}\n${stderr}`);
}

async function expectJson(path, expectedStatus, predicate, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();

  if (response.status !== expectedStatus || !predicate(body)) {
    throw new Error(
      `Unexpected response for ${path}: status ${response.status}, body ${JSON.stringify(body)}`
    );
  }
}
