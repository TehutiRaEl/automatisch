import { Router } from 'express';
import { randomUUID } from 'crypto';
import { createHash } from 'crypto';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

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
                '/colony/agents', '/healthcheck', '/api/v1/flows', '/api/v1/connections',
                '/api/v1/triggers', '/webhooks'],
    capabilities: ['workflow_automation', 'webhook_triggers', 'app_integrations',
                   'llm_chains', 'job_queue', 'mcp_support'],
    version: '1.0.0',
  });
});

router.post('/events', (req, res) => {
  res.json({ event_id: randomUUID(), status: 'received', colony_id: 'automatisch' });
});

router.get('/agents', (req, res) => {
  res.json([
    { agent_id: 'workflow-engine', name: 'Workflow Engine', status: 'active', role: 'automation' },
  ]);
});

export default router;
