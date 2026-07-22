import express, { Router } from 'express';
import { randomUUID, createHash, createHmac, timingSafeEqual } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

// AGPL-3.0 Section 13 (Remote Network Interaction) compliance: this fork's
// modified source must stay discoverable to anyone interacting with the
// running instance over a network. Real commit hash when available (a
// deployed image usually still has .git, or the platform sets a commit env
// var); falls back to 'unknown' rather than silently omitting the field.
const SOURCE_REPO_URL = 'https://github.com/TehutiRaEl/automatisch';

function currentSourceCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: process.cwd() })
      .toString()
      .trim();
  } catch {
    return process.env.SOURCE_COMMIT || process.env.GIT_SHA || 'unknown';
  }
}

const _HIVE_SECRET = process.env.HIVE_JWT_SECRET || '';

function verifyHiveSignature(req, rawBody) {
  if (!_HIVE_SECRET) return true; // permissive dev mode
  const sig = req.headers['x-hive-signature'] || '';
  if (!sig.startsWith('sha256=')) return false;
  const expected = 'sha256=' + createHmac('sha256', _HIVE_SECRET).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false; // length mismatch
  }
}

const router = Router();
const start = Date.now();

function soulHash() {
  try {
    const p = join(process.cwd(), 'soul.md');
    if (!existsSync(p)) return 'none';
    return createHash('sha256').update(readFileSync(p)).digest('hex').slice(0, 16);
  } catch {
    return 'none';
  }
}

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    colony_id: 'automatisch',
    timestamp: new Date().toISOString(),
    uptime_seconds: Math.floor((Date.now() - start) / 1000),
  });
});

router.get('/info', (req, res) => {
  res.json({
    colony_id: 'automatisch', colony_name: 'Automatisch', role: 'colony',
    archetype: 'workflow', layer: 7, entity: 'CHILD (Workflow Expression)',
    guilds: ['workflow', 'automation', 'integration'],
    hive: 'sovereign-hive', queen: 'https://github.com/TehutiRaEl/-sovereign-hive-meta',
    version: '1.0.0', soul_md_hash: soulHash(), port: 3000,
  });
});

router.get('/manifest', (req, res) => {
  res.json({
    colony_id: 'automatisch',
    endpoints: ['/colony/health', '/colony/info', '/colony/manifest', '/colony/events',
                '/colony/agents', '/colony/capabilities', '/healthcheck', '/api/v1/flows',
                '/api/v1/connections', '/api/v1/triggers', '/webhooks'],
    capabilities: ['workflow_automation', 'webhook_triggers', 'app_integrations',
                   'llm_chains', 'job_queue', 'mcp_support'],
    version: '1.0.0',
    // AGPL-3.0 Section 13: the corresponding source of the exact running
    // modified version, not just a generic "here's the project" link.
    source: {
      repo: SOURCE_REPO_URL,
      commit: currentSourceCommit(),
      license: 'AGPL-3.0',
    },
  });
});

router.get('/capabilities', (req, res) => {
  let identity = {};
  try {
    const p = join(process.cwd(), 'colony.json');
    if (existsSync(p)) identity = JSON.parse(readFileSync(p, 'utf8'));
  } catch {
    // fall through to inline identity
  }
  res.json({
    colony_id: 'automatisch',
    colony_name: 'Automatisch',
    role: 'colony',
    version: '1.0.0',
    ...identity,
    status: 'healthy',
    uptime_s: Math.round((Date.now() - start) / 100) / 10,
    soul_md_hash: soulHash(),
    health_endpoint: '/colony/health',
    capabilities_endpoint: '/colony/capabilities',
  });
});

router.post('/events', express.raw({ type: '*/*' }), (req, res) => {
  const rawBody = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body) || '{}');
  if (!verifyHiveSignature(req, rawBody)) {
    return res.status(401).json({ error: 'Invalid hive signature', colony_id: 'automatisch' });
  }
  let event;
  try {
    event = JSON.parse(rawBody.toString());
    if (!event.event_type) {
      return res.status(422).json({ error: 'Missing event_type', colony_id: 'automatisch' });
    }
  } catch {
    return res.status(422).json({ error: 'Invalid event body', colony_id: 'automatisch' });
  }
  res.json({ event_id: randomUUID(), status: 'received', colony_id: 'automatisch' });
});

router.get('/agents', (req, res) => {
  res.json([
    { agent_id: 'workflow-engine', name: 'Workflow Engine', status: 'active', role: 'automation' },
  ]);
});

export default router;
