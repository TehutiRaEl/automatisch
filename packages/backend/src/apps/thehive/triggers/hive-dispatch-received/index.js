import { createHmac, timingSafeEqual } from 'crypto';
import defineTrigger from '../../../../helpers/define-trigger.js';

// Same HMAC-SHA256-over-raw-body pattern as every colony's /colony/events
// (colony_sdk.py, colony.js, colony.go, aether's route.ts) — verified here
// instead of at a fixed endpoint, since automatisch delivers webhook
// triggers at a per-flow-instance URL. request.body is the raw text string
// (the webhook route parses with express.text(), not express.json() — see
// routes/webhooks.js), so it's exactly the byte sequence the signature was
// computed over.
function verifyHiveSignature(secret, headers, rawBody) {
  if (!secret) return true; // permissive dev mode, matching every other colony
  const sig = headers?.['x-hive-signature'] || '';
  if (!sig.startsWith('sha256=')) return false;
  const expected =
    'sha256=' + createHmac('sha256', secret).update(rawBody || '').digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false; // length mismatch
  }
}

export default defineTrigger({
  name: 'Hive Dispatch Received',
  key: 'hiveDispatchReceived',
  type: 'webhook',
  showWebhookUrl: true,
  description:
    'Triggers when THEHIVE (or another colony) dispatches a task_dispatch ' +
    '(or any) event to this flow — a real, HMAC-verified flow trigger instead ' +
    'of the bolt-on /colony/events HTTP side-channel.',
  arguments: [],

  async run($) {
    const rawBody = $.request.body;
    const secret = $.auth.data?.hiveSigningSecret;

    if (!verifyHiveSignature(secret, $.request.headers, rawBody)) {
      throw new Error('Invalid or missing X-Hive-Signature.');
    }

    let event = {};
    try {
      event = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    } catch {
      // not JSON — still deliver the raw text so the flow can inspect it
    }

    $.pushTriggerItem({
      raw: {
        event_type: event?.event_type || null,
        payload: event?.payload || event,
        headers: $.request.headers,
        query: $.request.query,
      },
      meta: {
        internalId: `${Date.now()}`,
      },
    });
  },

  async testRun($) {
    $.pushTriggerItem({
      raw: {
        event_type: 'task_dispatch',
        payload: { example: true, note: 'sample event for flow-building — no real dispatch occurred' },
      },
      meta: { internalId: 'test' },
    });
  },
});
