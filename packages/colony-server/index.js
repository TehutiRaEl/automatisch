#!/usr/bin/env node
// Sovereign Hive Colony Standard server for automatisch
// Standalone sidecar — does not modify the main automatisch app
// Run: node packages/colony-server/index.js  (default port 3030)
// In docker-compose, add a colony-sidecar service pointing to this file.

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.COLONY_PORT || 3030;
const START = Date.now();
const events = [];

const colonyJsonPath = path.join(__dirname, '../../colony.json');
const identity = JSON.parse(fs.readFileSync(colonyJsonPath, 'utf8'));

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data, null, 2));
}

const handlers = {
  'GET /colony/info': (_req, res) => json(res, identity),

  'GET /colony/health': (_req, res) =>
    json(res, {
      colony_id: identity.colony_id,
      status: 'healthy',
      uptime_seconds: Math.floor((Date.now() - START) / 1000),
      timestamp: new Date().toISOString(),
    }),

  'GET /colony/agents': (_req, res) =>
    json(res, {
      colony_id: identity.colony_id,
      agents: identity.agents.map((name) => ({
        id: name,
        status: 'active',
        capabilities: identity.capabilities,
      })),
    }),

  'POST /colony/events': (req, res) => {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      try {
        const evt = { ts: new Date().toISOString(), ...JSON.parse(body) };
        events.push(evt);
        if (events.length > 100) events.shift();
        json(res, { status: 'accepted', event_id: `evt-${Date.now()}` });
      } catch {
        json(res, { error: 'invalid JSON' }, 400);
      }
    });
  },

  'GET /colony/manifest': (_req, res) => {
    let soul = '';
    try {
      soul = fs.readFileSync(
        path.join(__dirname, '../../soul.md'),
        'utf8'
      );
    } catch {}
    json(res, {
      ...identity,
      soul_preview: soul.slice(0, 200),
      endpoints: {
        info: '/colony/info',
        health: '/colony/health',
        agents: '/colony/agents',
        events: '/colony/events',
        manifest: '/colony/manifest',
      },
    });
  },
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }
  const key = `${req.method} ${req.url.split('?')[0]}`;
  const handler = handlers[key];
  if (handler) return handler(req, res);
  json(res, { error: 'not found', path: req.url }, 404);
});

server.listen(PORT, () =>
  console.log(`[automatisch-colony] colony sidecar on :${PORT}`)
);
